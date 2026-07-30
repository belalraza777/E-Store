## Plan: Current Payment Flow (recommended)

A concise, provider-agnostic payment flow focused on correctness, security, and recoverability. The examples reference Razorpay for popup-based checkout, but the flow applies to Stripe/PayPal or other providers (use provider-specific SDKs and signature checks where applicable).

### High-level flow
- 1) Frontend requests a server-created payment order for a specific local order.
- 2) Server creates a provider order (e.g., Razorpay order) and returns the provider `order_id` and public `key` to the frontend.
- 3) Frontend opens provider checkout (popup or redirect) using the returned order info.
- 4) Provider calls client success handler; client posts provider payment details to server for verification.
- 5) Server verifies the signature (and/or uses provider APIs) and updates local order/payment records. Webhooks are used as the authoritative source for final state.

- `POST /api/payments/create-order`
   - Input: `{ orderId: string }` (server calculates amount and currency from trusted DB).
   - Action: create provider order, save `providerOrderId` and a `paymentAttempt` record, return `{ provider, keyId, providerOrderId, amount, currency }`.
- `POST /api/payments/verify`
   - Input: provider-specific payload (e.g., `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`) + `orderId`.
   - Action: verify signature (HMAC SHA256 using server `KEY_SECRET` for Razorpay), mark payment as `paid` if valid, persist provider response, and emit internal events (email, invoice, analytics).
- `POST /api/payments/webhook`
   - Action: receive provider webhook events (payment.captured, payment.failed, refund.processed), validate webhook signature, update payment/order status idempotently, and respond 200.
- `POST /api/payments/refund`
   - Action: server-side refund via provider API; update DB and notify user.

### Frontend integration (checkout)
- Checkout flow:
   1. Call `create-order` with the local `orderId`.
   2. Receive `{ keyId, providerOrderId, amount }` and open provider checkout.
   3. On checkout success callback, send provider payload to `verify` endpoint.
   4. Redirect user to order confirmation based on server response; treat webhooks as authoritative — show a Pending state until webhook confirms.

### Security & best practices
- Store `KEY_SECRET` and provider secrets in server environment variables; never send secrets to the client.
- Always compute amount and currency server-side (do not trust client totals).
- Use HMAC signature verification for both client-side checkout verification and webhook validation. For Razorpay verification example:

```js
// Node.js example (Razorpay signature verification)
const crypto = require('crypto');
function verifySignature(orderId, paymentId, signature, keySecret) {
   const payload = `${orderId}|${paymentId}`;
   const expected = crypto.createHmac('sha256', keySecret).update(payload).digest('hex');
   return expected === signature;
}
```

- Implement idempotency: store `paymentAttempt` records with an idempotency key, ignore duplicate events (webhook retries or repeated client verifies).
- Rate-limit `create-order` and `verify` endpoints to reduce abuse.
- Use HTTPS and enforce CORS policies for the frontend origin.

### Order lifecycle and reconciliation
- Suggested statuses: `created` -> `pending_payment` -> `processing` -> `paid` | `failed` | `refunded`.
- Consider webhooks the source of truth; after successful verify, still wait for webhook confirmation before finalizing shipping or access.
- Daily reconciliation job: query provider API for recent payments and reconcile mismatches, flag manual review.

### Database schema notes
- `payments` table fields: `id, orderId, provider, providerOrderId, paymentId, amount, currency, status, rawResponse, createdAt, updatedAt`.
- `paymentAttempts` table: `idempotencyKey, orderId, providerOrderId, status, attemptPayload, createdAt`.

### Testing and staging
- Use provider test/sandbox keys for dev.
- Simulate webhooks (providers offer webhook replay/test) and write integration tests for the full flow (create -> checkout -> verify -> webhook).

### Monitoring, retries, and refunds
- Log provider responses and webhook events (raw payload) for debugging.
- Implement retry/backoff for transient failures when calling provider APIs.
- Provide admin UI to trigger manual capture/refund and to mark orders manually in edge cases.

### Notifications and receipts
- On `paid`, generate invoice, send email, and update UI. Keep emails idempotent by tracking sent receipts per paymentId.

### Quick checklist
- [ ] Add provider keys to server env and vault.
- [ ] Implement `create-order`, `verify`, and webhook endpoints in `server/`.
- [ ] Add `payments` and `paymentAttempts` tables/migrations.
- [ ] Implement frontend checkout in `client/src/pages/Checkout/` with server calls.
- [ ] Add integration tests and webhook replay tests.

---

If you want, I can implement example server endpoints and a small frontend handler for Razorpay next. See [payment plan.md](payment%20plan.md) for this updated plan.