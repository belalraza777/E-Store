# 🛒 E-Store — Full-Stack E-Commerce Platform

A modern, full-featured e-commerce platform built with **React 19**, **Express 5**, **MongoDB**, and **Redis** — complete with an **AI shopping assistant**, **Razorpay payments**, **Google OAuth**, and a full **admin dashboard**.

---

## ✨ Features

### 🛍️ Shopping
- Browse products by category with sorting & pagination
- Full-text product search with Redis caching
- Product detail pages with SEO-friendly slugs
- Shopping cart with discount price support
- Wishlist with heart-icon toggle
- Smart product recommendations (order-history & category based)

### 🤖 AI Shopping Assistant
- Conversational chatbot powered by **LangChain + Groq (LLaMA 3.3 70B)**
- ReAct agent with tools to browse products, view cart, check orders, list categories, and submit complaints
- Per-user chat history stored in Redis (auto-expires after 1 hour)

### 💳 Payments
- **Razorpay** integration (online payments in INR)
- Cash on Delivery (COD) support
- HMAC SHA256 signature verification for payment security
- Automated payment confirmation emails

### 👤 Authentication & Users
- JWT-based auth with httpOnly cookies
- **Google OAuth 2.0** via Passport.js
- Email verification & password reset
- Role-based access control (User / Admin)

### 📦 Orders
- Place orders with automatic stock reduction
- Order confirmation emails via Gmail (Nodemailer)
- Track order status (Placed → Shipped → Delivered)
- Cancel orders with reason

### ⭐ Reviews & Ratings
- 1–5 star ratings with verified-purchase badges
- Auto-calculated average ratings on products
- Review spam prevention via rate limiting

### 🔧 Admin Dashboard
- Product CRUD with Cloudinary image uploads (up to 5 images)
- Stock management
- Order management with status updates & filtering
- User management (view / block / unblock)

### ⚡ Performance
- **Redis caching** across products, reviews, recommendations, search, and AI agent
- Rate limiting on all routes (global + per-feature)
- Lazy-loaded routes for admin & heavy pages
- Optimized MongoDB indexes

---

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, React Router 7, Zustand, Framer Motion, Vite 7 |
| **Backend** | Express 5, Node.js (ES Modules) |
| **Database** | MongoDB (Mongoose 9) |
| **Cache** | Redis (ioredis) |
| **AI** | LangChain, LangGraph, Groq (LLaMA 3.3 70B) |
| **Payments** | Razorpay |
| **Auth** | JWT, Passport.js (Google OAuth 2.0), bcrypt |
| **File Storage** | Cloudinary (via Multer) |
| **Email** | Nodemailer (Gmail) |
| **Validation** | Joi (server), Zod (AI agent schemas) |
| **UI** | React Icons, React Markdown, Sonner (toasts), jsPDF (invoices) |

---

## 📁 Project Structure

```
E-STORE/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── api/                # Axios API layer (auth, cart, orders, products, etc.)
│   │   ├── assets/             # Static assets
│   │   ├── components/         # Reusable components
│   │   │   ├── FunctionalBtn/  #   Action buttons (add-to-cart, wishlist toggle)
│   │   │   ├── OnlinePayment/  #   Razorpay checkout UI
│   │   │   ├── product/        #   Product cards & lists
│   │   │   ├── profile/        #   Profile display/edit
│   │   │   ├── Recommendation/ #   Product recommendations
│   │   │   ├── reviews/        #   Review list, form, ratings
│   │   │   └── ui/             #   Skeleton loaders & primitives
│   │   ├── context/            # React Context (auth)
│   │   ├── helper/             # Client-side helpers (invoices, stats, etc.)
│   │   ├── layout/             # Header, Footer, Admin & User layouts
│   │   ├── pages/              # Route pages
│   │   │   ├── Admin/          #   Dashboard, Products, Orders, Users
│   │   │   ├── Ai_Agent/       #   AI chat assistant
│   │   │   ├── Auth/           #   Login, Register, OAuth
│   │   │   ├── Cart/           #   Shopping cart
│   │   │   ├── Checkout/       #   Checkout flow
│   │   │   ├── Home/           #   Homepage
│   │   │   ├── Order/          #   Order list & detail
│   │   │   ├── Product/        #   Product list & detail
│   │   │   ├── Profile/        #   User profile
│   │   │   ├── Wishlist/       #   Wishlist page
│   │   │   └── ...             #   Contact, Feedback, Legal, Search, etc.
│   │   ├── routes/             # App routing & protected routes
│   │   ├── store/              # Zustand state management
│   │   └── utils/              # Client utilities
│   └── package.json
│
├── server/                     # Express backend
│   ├── ai_agent/               # AI shopping assistant (LangChain + Groq)
│   │   ├── agent.js            #   ReAct agent setup & chat history
│   │   ├── tools.js            #   Agent tools (products, cart, orders, etc.)
│   │   └── systemPrompt.js     #   Agent personality & rules
│   ├── config/                 # DB, Redis, Cloudinary, Passport, Email
│   ├── constants/              # Product categories
│   ├── controllers/
│   │   ├── admin/              #   Admin: products, orders, users
│   │   ├── common/             #   Shared: auth, product search
│   │   └── user/               #   User: cart, orders, reviews, profile, etc.
│   ├── helper/                 # Auth utils, recommendations, slugs
│   ├── middlewares/            # Auth, admin, validation, rate limit, upload, errors
│   ├── models/                 # Mongoose schemas (User, Product, Order, Cart, etc.)
│   ├── routes/                 # Express route definitions
│   ├── utils/                  # Async wrapper, Redis cache helpers
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **Redis** (local or cloud)
- **Razorpay** account (for payments)
- **Google Cloud** project (for OAuth)
- **Cloudinary** account (for image uploads)
- **Gmail** App Password (for emails)
- **Groq** API key (for AI agent)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/e-store.git
cd e-store
```

### 2. Setup the server

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
# Server
PORT=5000

# Database
MONGODB_URL=mongodb://127.0.0.1:27017/E-store

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
CLOUDINARY_FOLDER=estore_media

# Email (Gmail)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# AI Agent (Groq)
GROQ_API_KEY=your_groq_api_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npx nodemon
```

### 3. Setup the client

```bash
cd client
npm install
```

Create a `.env` file in `/client`:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the dev server:

```bash
npm run dev
```

### 4. Open the app

Visit [http://localhost:5173](http://localhost:5173)

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/auth/check` | Check auth status |
| PATCH | `/api/v1/auth/reset` | Reset password |
| GET | `/api/v1/auth/google` | Google OAuth login |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | Get all products (paginated) |
| GET | `/api/v1/products/:slug` | Get product by slug |
| POST | `/api/v1/products/search` | Search products |
| GET | `/api/v1/products/categories` | Get categories |
| POST | `/api/v1/products` | Create product (admin) |
| PUT | `/api/v1/products/:id` | Update product (admin) |
| DELETE | `/api/v1/products/:id` | Delete product (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/cart` | Get user's cart |
| POST | `/api/v1/cart/:productId/:quantity` | Add to cart |
| PUT | `/api/v1/cart/:itemId/:quantity` | Update quantity |
| DELETE | `/api/v1/cart/:itemId` | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/orders` | Place order |
| GET | `/api/v1/orders/my` | Get my orders |
| GET | `/api/v1/orders/:id` | Get order details |
| POST | `/api/v1/orders/:id/cancel` | Cancel order |
| GET | `/api/v1/orders` | Get all orders (admin) |
| PUT | `/api/v1/orders/:id/status` | Update status (admin) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payments/create-order` | Create Razorpay order |
| POST | `/api/v1/payments/verify` | Verify payment |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reviews/product/:productId` | Get product reviews |
| POST | `/api/v1/reviews/:productId` | Add review |
| DELETE | `/api/v1/reviews/:reviewId` | Delete review |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/profile` | Get profile |
| PATCH | `/api/v1/profile` | Update profile |
| PATCH | `/api/v1/profile/avatar` | Update avatar |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/wishlists` | Get wishlist |
| POST | `/api/v1/wishlists` | Add to wishlist |
| DELETE | `/api/v1/wishlists/:productId` | Remove from wishlist |

### AI Agent
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/agents/chat` | Chat with AI assistant |
| DELETE | `/api/v1/agents/clear-session` | Clear chat session |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/recommendations/:category` | Get recommendations |

---

## 🔒 Security

- JWT tokens stored in **httpOnly cookies** (no XSS exposure)
- **bcrypt** password hashing (salt rounds: 10)
- **HMAC SHA256** payment signature verification
- **Rate limiting** on all routes:
  - Global: 400 req / 10 min
  - Auth: 5 req / 15 min
  - Search: 30 req / min
  - Reviews: 10 req / 15 min
  - Cart: 80 req / 10 min
- **Joi validation** on all request bodies
- **CORS** restricted to frontend origin
- **Cloudinary** server-side uploads only (no direct client uploads)
- Admin routes double-gated: `verifyAuth` → `verifyAdmin`

---

## 📂 Product Categories

Electronics · Clothing · Books · Groceries · Sports · Beauty · Toys · Furniture · Automotive · Jewelry · Health

---

## 📄 License

This project is licensed under the ISC License.
