## API Audit Report - Frontend vs Backend

### ✅ PRODUCTS API
| Endpoint | Frontend | Backend | Status |
|----------|----------|---------|--------|
| GET /products | getAllProducts | productController.getAllProducts | ✅ MATCH |
| GET /products/:slug | getProductBySlug | productController.getProductBySlug | ✅ MATCH |
| GET /products/categories | getCategories | hardcoded CATEGORIES | ✅ MATCH |
| POST /products | createProduct | adminProductController.createProduct | ✅ MATCH |
| PUT /products/:id | updateProduct | adminProductController.updateProduct | ✅ MATCH |
| DELETE /products/:id | deleteProduct | adminProductController.deleteProduct | ✅ MATCH |
| PATCH /products/:id/stock | updateProductStock | adminProductController.updateStock | ✅ MATCH |

---

### ⚠️ CART API
| Endpoint | Frontend | Backend | Status | Notes |
|----------|----------|---------|--------|-------|
| GET /cart | getCart | cartController.getCart | ✅ MATCH | |
| POST /cart/:productId/:quantity | addToCart | cartController.addToCart | ✅ MATCH | |
| PUT /cart/:itemId/:quantity | updateCartItem | cartController.updateCartItem | ✅ MATCH | |
| DELETE /cart/:itemId | removeFromCart | cartController.removeFromCart | ✅ MATCH | |

---

### ❌ ORDER API - MISMATCH FOUND!
| Endpoint | Frontend | Backend | Status | Issue |
|----------|----------|---------|--------|-------|
| POST /orders | createOrder | orderController.createOrder | ✅ MATCH | |
| GET /orders/my | getMyOrders | orderController.getMyOrders | ✅ MATCH | |
| DELETE /orders/:orderId | cancelOrder (DELETE) | orderController.cancelOrder (PUT /:id/cancel) | ❌ MISMATCH | Frontend uses DELETE, backend uses PUT with /cancel suffix |
| GET /orders | getAllOrders | orderController.getAllOrders | ✅ MATCH | |
| GET /orders/filter | filterOrders | orderController.filterOrders | ✅ MATCH | |
| PUT /orders/:id/status | updateOrderStatus | orderController.updateOrderStatus | ✅ MATCH | |

**ISSUE**: Frontend calls `DELETE /orders/:orderId` but backend expects `PUT /orders/:id/cancel`

---

### ✅ PROFILE API
| Endpoint | Frontend | Backend | Status |
|----------|----------|---------|--------|
| GET /profile | fetchProfile | profileController.getProfile | ✅ MATCH |
| PATCH /profile | updateProfile | profileController.updateProfile | ✅ MATCH |
| PATCH /profile/avatar | updateAvatar | profileController.updateAvatar | ⚠️ ROUTE ORDER ISSUE |
| PATCH /profile/:userId/block | toggleUserBlock | profileController.setBlockStatus | ✅ MATCH |

**ISSUE**: Avatar route comes AFTER specific route - backend will match `:userId/block` first!

---

### ✅ REVIEW API
| Endpoint | Frontend | Backend | Status |
|----------|----------|---------|--------|
| POST /reviews/:productId | addReview | reviewController.addReview | ✅ MATCH |
| GET /reviews/product/:productId | getProductReviews | reviewController.getProductReviews | ✅ MATCH |
| DELETE /reviews/:reviewId | deleteReview | reviewController.deleteReview | ✅ MATCH |

---

### ✅ AUTH API
| Endpoint | Frontend | Backend | Status |
|----------|----------|---------|--------|
| POST /auth/login | login | authController.loginUser | ✅ MATCH |
| POST /auth/register | register | authController.register | ✅ MATCH |
| GET /auth/logout | logout | authController.logoutUser | ✅ MATCH |
| GET /auth/check | checkAuth | authController.checkUser | ✅ MATCH |
| PATCH /auth/reset | resetPassword | authController.resetPassword | ✅ MATCH |

---

## CRITICAL FIXES NEEDED:

1. **Order Cancel API**: 
   - Frontend sends: `DELETE /orders/:orderId` with reason in body
   - Backend expects: `PUT /orders/:id/cancel` with reason in body
   - **FIX**: Update frontend orderApi.js cancelOrder function

2. **Profile Routes Order**:
   - The route `/profile/avatar` must come BEFORE `/profile/:userId/block`
   - Currently `:userId/block` matches first
   - **FIX**: Reorder routes in profileRoute.js

