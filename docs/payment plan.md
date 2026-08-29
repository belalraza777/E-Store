## Plan: Current Payment Flow

A concise, provider-agnostic payment flow focused on correctness, security, and recoverability. The examples reference Razorpay for popup-based checkout, but the flow applies to Stripe/PayPal or other providers (use provider-specific SDKs and signature checks where applicable).

### High-level flow
- 1) Frontend requests a server-created payment order for a specific local order.
- 2) Server creates a provider order (Razorpay order) and returns the provider `order_id` and public `key` to the frontend.
- 3) Frontend opens Razorpay checkout popup using the returned order info.
- 4) Provider calls client success handler; client posts provider payment details to server for verification.
- 5) Server verifies the HMAC SHA256 signature and updates local order/payment records. Webhooks are used as the authoritative source for final state.

### Endpoints

- `POST /api/payments/create-order`
   - Input: `{ orderId: string }` (server calculates amount and currency from trusted DB).
   - Action: create Razorpay order, save `razorpay.orderId` on the Order document, return `{ keyId, razorpayOrder, amount, currency }`.

- `POST /api/payments/verify`
   - Input: `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`, `orderId`.
   - Action: verify HMAC SHA256 signature using server `RAZORPAY_KEY_SECRET`, mark `paymentStatus` as `paid`, persist `razorpay.paymentId` and `razorpay.signature` on Order, send confirmation email.

- `POST /api/payments/failed`
   - Input: `{ orderId, reason }`.
   - Action: called by client on user cancellation or timeout; marks order as `failed`, cancels it, restores stock, sends cancellation email. Guards against duplicate calls (`paymentStatus === "failed" && isCancelled` check).

- `POST /api/payments/webhook`
   - Action: receive `payment.captured` and `payment.failed` events from Razorpay servers, validate webhook signature (HMAC SHA256 using `RAZORPAY_WEBHOOK_SECRET`), update order status idempotently, respond 200. No `verifyAuth` — trust comes from signature verification.

- Refunds are triggered automatically inside `cancelOrderLogic` — no separate endpoint. When a paid online order is cancelled, `processRefundService` calls the Razorpay Refund API and updates `paymentStatus` to `refunded`.

### Frontend integration (checkout)
- Checkout flow:
   1. Call `create-order` with the local `orderId`.
   2. Receive `{ keyId, razorpayOrder, amount }` and open Razorpay checkout popup.
   3. On checkout success callback, send provider payload to `verify` endpoint.
   4. On checkout dismissal or failure, call `failed` endpoint to cancel the order and restore stock.
   5. Redirect user to order confirmation based on server response.

### Refund flow
- Refunds are not user-initiated via a dedicated endpoint.
- When a user cancels an order (`POST /api/orders/:id/cancel`), `cancelOrderLogic` checks:
  - `paymentMethod === "Online"` AND `paymentStatus === "paid"`
- If both true, `processRefundService` is called fire-and-forget (`.catch()` logs error but never blocks cancellation).
- `processRefundService` calls `razorpay.payments.refund(paymentId, { amount, speed, notes })` and updates the Order:
  - `paymentStatus` → `"refunded"`
  - `refund.refundId`, `refund.amount`, `refund.status`, `refund.initiatedAt`
- Refund reflects in the customer's original payment source within 5–7 business days.

### Security & best practices
- Store `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` in server environment variables; never send secrets to the client.
- Always compute amount and currency server-side (do not trust client totals).
- Use HMAC SHA256 signature verification for both client-side checkout verification and webhook validation.

```js
// Razorpay signature verification
const crypto = require('crypto');
function verifySignature(orderId, paymentId, signature, keySecret) {
   const payload = `${orderId}|${paymentId}`;
   const expected = crypto.createHmac('sha256', keySecret).update(payload).digest('hex');
   return expected === signature;
}
```

- Idempotency: duplicate webhook events and repeated client verify calls are guarded by `paymentStatus === "paid"` early-return checks.
- Rate-limit `create-order` and `verify` endpoints to reduce abuse.
- Use HTTPS and enforce CORS policies for the frontend origin.

### Order lifecycle

```
paymentStatus:  pending → paid | failed | refunded
orderStatus:    placed  → shipped → delivered | cancelled
```

- `paymentStatus` and `orderStatus` are updated independently — a cancelled order with a successful prior payment moves to `refunded`, not just `cancelled`.
- Webhooks are the authoritative source of truth; client-side verify is a fast-path optimistic update.

### Database schema

No separate `payments` or `paymentAttempts` collection. All payment data lives on the `Order` document:

```
Order {
  paymentMethod:  "Online" | "COD"
  paymentStatus:  "pending" | "paid" | "failed" | "refunded"
  razorpay: {
    orderId:    string   // Razorpay order ID
    paymentId:  string   // Razorpay payment ID (set after verify)
    signature:  string   // HMAC signature (set after verify)
  }
  refund: {
    refundId:    string  // Razorpay refund ID
    amount:      number  // Refund amount in INR
    status:      "initiated" | "processed" | "failed"
    initiatedAt: Date
  }
}
```

### Testing and staging
- Use Razorpay test/sandbox keys for dev.
- Simulate webhooks using Razorpay Dashboard webhook replay.
- Write integration tests for the full flow: `create-order` → checkout → `verify` → webhook.
- Test `failed` endpoint for user cancellation and timeout scenarios.
- Test refund flow by cancelling a paid online order and verifying `paymentStatus === "refunded"`.

### Monitoring and refunds
- Log provider responses and raw webhook payloads for debugging.
- Implement retry/backoff for transient failures when calling Razorpay APIs.
- Refund failures are non-blocking — logged via `console.error` and do not affect order cancellation.

### Notifications
- `paid` → payment confirmation email (fire-and-forget).
- `failed` / signature mismatch → cancellation email (fire-and-forget).
- `cancelled` with refund → cancellation email includes refund notice with 5–7 business day timeline.

### Quick checklist
- [x] Add Razorpay keys to server env
- [x] Implement `create-order`, `verify`, `failed`, and `webhook` endpoints
- [x] HMAC SHA256 signature verification on verify and webhook
- [x] Refund flow inside `cancelOrderLogic` via `processRefundService`
- [x] Frontend checkout with `create-order` → popup → `verify` → `failed` fallback
- [x] Refund notice in cancellation email and order detail UI
- [ ] Daily reconciliation job — query Razorpay API and reconcile mismatches
- [ ] Admin UI for manual refund trigger and order status override
- [ ] Integration tests and webhook replay tests