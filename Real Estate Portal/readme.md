# 🏠 Real Estate Buyer Portal

A full-stack MERN application for a real estate buyer portal with JWT authentication and a personal favourites system.

---

## Tech Stack

| Layer     | Technology                                        |
|-----------|---------------------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Tailwind CSS, Axios |
| Backend   | Node.js, Express.js                               |
| Database  | MongoDB (local), Mongoose ODM                     |
| Auth      | JWT (jsonwebtoken), bcryptjs                      |
| Validation| express-validator (server), custom hooks (client) |

---

## Project Structure

```
real-estate-portal/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── favouriteController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Favourite.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── properties.js
│   │   └── favourites.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── PropertyCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── DashboardPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## Prerequisites

- Node.js v18+
- MongoDB running locally on port 27017
- npm

---

## Getting Started

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment variables

The `.env` file is already configured at `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/real-estate-portal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

> ⚠️ Change `JWT_SECRET` to a strong random string before deploying.

### 3. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 4. Run the app

Open **two terminals**:

```bash
# Terminal 1 - Backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 - Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Example Flows

### Flow 1: Register → Dashboard
1. Go to `http://localhost:5173`
2. Click **"Create one"** → fill in name, email, password
3. You're logged in and redirected to the Dashboard
4. Click **"Load Sample Properties"** to seed 6 properties

### Flow 2: Add & Remove Favourites
1. Click the ❤️ on any property → heart turns red, added to favourites
2. Click **"My Favourites"** tab to see saved properties
3. Click the red ❤️ to remove it

### Flow 3: Auth Enforcement
1. Visit `/dashboard` without logging in → redirected to `/login`
2. Each user can only see and modify **their own** favourites (enforced server-side)

---

## API Endpoints

### Auth
| Method | Endpoint           | Access  | Description       |
|--------|--------------------|---------|-------------------|
| POST   | /api/auth/register | Public  | Register new user |
| POST   | /api/auth/login    | Public  | Login             |
| GET    | /api/auth/me       | Private | Get current user  |

### Properties
| Method | Endpoint              | Access  | Description                     |
|--------|-----------------------|---------|---------------------------------|
| GET    | /api/properties       | Private | All properties + favourite flag |
| POST   | /api/properties/seed  | Public  | Seed sample data (dev only)     |

### Favourites
| Method | Endpoint                    | Access  | Description            |
|--------|-----------------------------|---------|------------------------|
| GET    | /api/favourites             | Private | Get user's favourites  |
| POST   | /api/favourites/:propertyId | Private | Add to favourites      |
| DELETE | /api/favourites/:propertyId | Private | Remove from favourites |

---

## Security Highlights

- Passwords hashed with **bcryptjs** (12 salt rounds) — never stored in plain text
- JWT tokens expire after 7 days
- All private routes require `Authorization: Bearer <token>`
- Favourites are scoped per user — enforced via `req.user._id` on every query
- Duplicate favourites blocked at DB level (compound unique index)
