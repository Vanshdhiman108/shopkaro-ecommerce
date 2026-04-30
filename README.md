# 🛍️ ShopKaro — Full-Stack E-Commerce Platform

React + Node.js + Express + MongoDB + Razorpay/Stripe

---

## 📁 Project Structure

```
ecommerce/
├── backend/          ← Node.js + Express + MongoDB API
│   ├── server.js
│   ├── .env.example
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── frontend/         ← React app
    ├── public/
    └── src/
        ├── context/
        ├── components/
        ├── pages/
        └── utils/
```

---

## ✅ Prerequisites

Make sure these are installed on your machine:

| Tool | Download |
|------|----------|
| Node.js (v18+) | https://nodejs.org |
| MongoDB Community | https://www.mongodb.com/try/download/community |
| Git (optional) | https://git-scm.com |

---

## 🚀 Step-by-Step Setup

### Step 1 — Start MongoDB

**Windows:**
```
net start MongoDB
```
Or open **MongoDB Compass** and connect to `mongodb://localhost:27017`

**Mac/Linux:**
```bash
brew services start mongodb-community
# OR
sudo systemctl start mongod
```

---

### Step 2 — Setup Backend

```bash
# 1. Go to backend folder
cd ecommerce/backend

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
```

Now open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=any_long_random_string_here_12345

# Razorpay (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXX

# Stripe (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXX

CLIENT_URL=http://localhost:3000
```

```bash
# 4. Start backend server
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

Test it: open http://localhost:5000 — you should see `{ "message": "E-Commerce API Running ✅" }`

---

### Step 3 — Setup Frontend

Open a **new terminal** (keep backend running):

```bash
# 1. Go to frontend folder
cd ecommerce/frontend

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
```

Open `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXX
```

```bash
# 4. Start frontend
npm start
```

App opens at → **http://localhost:3000** 🎉

---

## 🔑 Create Admin User

After both servers are running, use any REST client (Postman / Thunder Client) or run:

```bash
# Register a user first via the app or API:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@shop.com","password":"admin123"}'
```

Then open MongoDB Compass → `ecommerce` DB → `users` collection → find your user → change `role` from `"customer"` to `"admin"` → Save.

Now login with that email — you'll see the **Admin** link in the navbar.

---

## 📡 API Routes Reference

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/update-profile` | Private |

### Products
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |
| POST | `/api/products/:id/review` | Private |

### Cart
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/cart` | Private |
| POST | `/api/cart/add` | Private |
| PUT | `/api/cart/update` | Private |
| DELETE | `/api/cart/remove/:productId` | Private |
| DELETE | `/api/cart/clear` | Private |

### Orders
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/orders` | Private |
| GET | `/api/orders/my-orders` | Private |
| GET | `/api/orders/:id` | Private |
| PUT | `/api/orders/:id/pay` | Private |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id/status` | Admin |

### Payment
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/payment/razorpay/create-order` | Private |
| POST | `/api/payment/razorpay/verify` | Private |
| POST | `/api/payment/stripe/create-intent` | Private |

### Admin
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/users` | Admin |
| DELETE | `/api/admin/users/:id` | Admin |

---

## 🧪 Add Sample Products (Optional)

In MongoDB Compass, go to `ecommerce` → `products` collection → Insert Document:

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
  "numReviews": 12,
  "reviews": [],
  "isFeatured": true
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose (MVC pattern) |
| Auth | JWT + bcryptjs (role-based: admin/customer) |
| Payment | Razorpay, Stripe |
| HTTP Client | Axios |
| Notifications | react-hot-toast |

---

## 🐛 Common Issues

**MongoDB not connecting?**
- Make sure MongoDB service is running
- Check `MONGO_URI` in `.env`

**CORS error?**
- Make sure `CLIENT_URL=http://localhost:3000` in backend `.env`

**Razorpay not working?**
- Use test keys from https://dashboard.razorpay.com
- Test card: `4111 1111 1111 1111`, any future date, any CVV

**`npm install` fails?**
- Try `npm install --legacy-peer-deps`
- Make sure Node.js version is 18+: `node --version`
