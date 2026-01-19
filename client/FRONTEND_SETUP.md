# Frontend Setup

## State Management

### Authentication - Context API
Auth state is managed via **Context API** (`src/context/authContext.jsx`)

**Usage:**
```jsx
import { useAuth } from './context/authContext';

const { user, token, handleLogin, handleLogout } = useAuth();
```

### Other State - Zustand
Products, Cart, Orders use **Zustand stores** for simple state management.

**Usage:**
```jsx
import useProductStore from './store/productStore';
import useCartStore from './store/cartStore';

const { products, setProducts } = useProductStore();
const { cart, setCart } = useCartStore();
```

## API Structure

```
src/
├── api/
│   ├── axios.js          - Configured axios instance
│   ├── authApi.js        - Auth API functions for Context
│   └── index.js          - Other API endpoints (products, cart, orders, reviews)
├── context/
│   └── authContext.jsx   - Auth Context Provider
├── store/
│   ├── productStore.js   - Product Zustand store
│   ├── cartStore.js      - Cart Zustand store
│   └── orderStore.js     - Order Zustand store
└── socket.js             - Socket placeholder
```

## Features

- ✅ Auto token injection via axios interceptors
- ✅ Auth state persists in localStorage
- ✅ Context API for auth (with socket support)
- ✅ Zustand for other state
- ✅ All API endpoints pre-configured
- ✅ Error handling built-in

## Environment

Create `.env` file:
```
VITE_API_URL=http://localhost:5000/api/v1
```
