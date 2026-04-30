# 🛍️ ShopKaro — Full-Stack E-Commerce Platform

> **Production-ready MERN stack application** with real payment processing, JWT authentication, role-based access control, and MVC architecture.

**Tech Stack:** React 18 · Node.js · Express.js · MongoDB · Razorpay · Stripe · JWT · TailwindCSS

---

## 🚀 Key Features

| Feature | Implementation |
|---------|---------------|
| **Authentication** | JWT-based login/register with bcrypt password hashing, session management |
| **Role-Based Access** | Admin vs Customer roles — all admin routes protected via middleware |
| **Product Catalogue** | Search, filter by category/price, pagination, sort, product reviews |
| **Shopping Cart** | Persistent cart with stock validation, add/update/remove/clear |
| **Order Management** | Place orders, track status (Processing → Confirmed → Shipped → Delivered) |
| **Live Payments** | Razorpay (INR) with HMAC-SHA256 signature verification + Stripe (international) |
| **Admin Dashboard** | Revenue stats, user management, order lifecycle control |
| **RESTful API** | 20+ documented API routes following REST conventions |
| **MVC Architecture** | Clean separation: models / controllers / routes / middleware |

---

## 📁 Project Structure

```
ecommerce/
├── backend/                    ← Node.js + Express + MongoDB API
│   ├── server.js               ← App entry, middleware, route mounting
│   ├── config/
│   │   └── db.js               ← MongoDB connection
│   ├── controllers/            ← Business logic
│   │   ├── authController.js   ← Register, login, profile
│   │   ├── productController.js← CRUD + search/filter/pagination + reviews
│   │   ├── orderController.js  ← Create order, status tracking
│   │   ├── cartController.js   ← Cart CRUD with stock validation
│   │   ├── paymentController.js← Razorpay + Stripe integration
│   │   └── adminController.js  ← Dashboard stats, user management
│   ├── models/
│   │   ├── User.js             ← bcrypt password hashing, role enum
│   │   ├── Product.js          ← Reviews, ratings, categories, stock
│   │   ├── Order.js            ← Order lifecycle, payment result
│   │   └── Cart.js             ← Persistent cart per user
│   ├── middleware/
│   │   └── auth.js             ← JWT protect + admin authorize
│   └── routes/                 ← Route definitions (auth/product/cart/order/payment/admin)
└── frontend/                   ← React 18 app
    └── src/
        ├── pages/              ← Home, Products, Cart, Checkout, Orders, Admin
        ├── components/         ← Navbar, ProtectedRoute, common UI
        ├── context/            ← AuthContext, CartContext (React Context API)
        └── utils/
            └── api.js          ← Axios base config
```

---

## 📡 API Reference

### Authentication
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Private | Get logged-in user |
| PUT | `/api/auth/update-profile` | Private | Update name/phone/address |

### Products
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/products` | Public | List with search, filter, pagination |
| GET | `/api/products/:id` | Public | Single product detail |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/:id/review` | Private | Add review (one per user) |

### Cart
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/cart` | Private | Get user's cart |
| POST | `/api/cart/add` | Private | Add item (stock validated) |
| PUT | `/api/cart/update` | Private | Update quantity |
| DELETE | `/api/cart/remove/:productId` | Private | Remove item |
| DELETE | `/api/cart/clear` | Private | Clear cart |

### Orders
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/orders` | Private | Place new order |
| GET | `/api/orders/my-orders` | Private | List user's orders |
| GET | `/api/orders/:id` | Private | Order detail (owner/admin only) |
| PUT | `/api/orders/:id/pay` | Private | Mark as paid |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |

### Payment
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/payment/razorpay/create-order` | Private | Create Razorpay order |
| POST | `/api/payment/razorpay/verify` | Private | Verify HMAC signature |
| POST | `/api/payment/stripe/create-intent` | Private | Create Stripe PaymentIntent |

### Admin
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/admin/dashboard` | Admin | Revenue, users, orders stats |
| GET | `/api/admin/users` | Admin | All users |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |

---

## ⚙️ Setup & Installation

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| MongoDB | Community | https://www.mongodb.com/try/download/community |

---

### Step 1 — Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
brew services start mongodb-community
# OR
sudo systemctl start mongod
```

---

### Step 2 — Backend Setup

```bash
cd ecommerce/backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRE=7d

# Razorpay — https://dashboard.razorpay.com
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXX

# Stripe — https://dashboard.stripe.com
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXX

CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
# ✅ MongoDB Connected
# 🚀 Server running on port 5000
```

Test: `GET http://localhost:5000` → `{ "message": "E-Commerce API Running ✅" }`

---

### Step 3 — Frontend Setup

Open a **new terminal**:

```bash
cd ecommerce/frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXX
```

```bash
npm start
# App opens at http://localhost:3000
```

---

### Step 4 — Create Admin User

Register a user through the app, then:

1. Open **MongoDB Compass** → `ecommerce` DB → `users` collection
2. Find your user → change `role` from `"customer"` to `"admin"` → Save
3. Log in — you'll see the **Admin** panel in the navbar

Or via curl:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@shop.com","password":"admin123"}'
```

---

## 🔐 Security Implementation

- **JWT Authentication** — tokens expire in 7 days, verified on every protected route
- **bcryptjs** — passwords hashed with salt rounds of 12 before storage
- **Role-Based Authorization** — `authorize('admin')` middleware blocks non-admin access at route level
- **Razorpay Signature Verification** — HMAC-SHA256 signature validated before marking any payment as paid
- **Ownership Check** — users can only access their own orders; admin bypasses this

---

## 💳 Payment Testing

### Razorpay (Test Mode)
| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | `1234` |

Get test keys: https://dashboard.razorpay.com → Settings → API Keys → Test Mode

### Stripe (Test Mode)
| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVV | Any 3 digits |

Get test keys: https://dashboard.stripe.com → Developers → API Keys

---

## 🧪 Sample Product (MongoDB Compass)

Insert into `ecommerce` → `products`:
```json
{
  "name": "Wireless Earbuds Pro",
  "description": "Premium sound quality with 30hr battery life and ANC.",
  "price": 1999,
  "category": "Electronics",
  "brand": "SoundMax",
  "stock": 50,
  "images": ["https://via.placeholder.com/400x400?text=Earbuds"],
  "ratings": 4.5,
  "numReviews": 0,
  "reviews": [],
  "isFeatured": true
}
```

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Context API, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose (MVC pattern) |
| Auth | JWT + bcryptjs (role-based: admin/customer) |
| Payment | Razorpay (INR), Stripe (international) |
| HTTP Client | Axios |
| Notifications | react-hot-toast |
| Dev Tools | nodemon, dotenv |

---

## 🐛 Common Issues

**MongoDB not connecting?**
- Confirm MongoDB service is running: `mongod --version`
- Check `MONGO_URI` in `.env` is correct

**CORS error in browser?**
- Verify `CLIENT_URL=http://localhost:3000` in backend `.env`
- Ensure both servers are running on their respective ports

**Razorpay payment fails?**
- Must use test API keys (not live keys during development)
- Ensure `RAZORPAY_KEY_ID` matches in both backend `.env` and frontend `.env`

**`npm install` fails?**
- Run `npm install --legacy-peer-deps`
- Ensure Node.js v18+: `node --version`

**Admin routes returning 403?**
- Make sure the logged-in user's `role` is `"admin"` in the database

---

## 👨‍💻 Author

**Vansh Dhiman** — Full-Stack Developer (MERN Stack)

📧 vanshdhiimann@gmail.com · 🔗 [LinkedIn](https://linkedin.com/in/vansh-dhiman-391928247)

---

*Built with React · Node.js · Express · MongoDB · Razorpay · Stripe*