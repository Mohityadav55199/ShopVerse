# ShopVerse - MERN E-Commerce Platform

A full-featured e-commerce application built using the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS for styling. Supports 3-tier Role-Based Access Control (**Customer**, **Vendor**, **Admin**).

## Author & Project Info

- **Author:** Mohit Yadav ([Mohityadav55199](https://github.com/Mohityadav55199))
- **GitHub Repository:** [https://github.com/Mohityadav55199/ShopVerse](https://github.com/Mohityadav55199/ShopVerse)
- **Live Frontend (Vercel):** [https://shop-verse-lac.vercel.app](https://shop-verse-lac.vercel.app)

## Quick Demo Accounts

- **Customer (Buy Only):** `customer@example.com` / `password123`
- **Vendor (Buy & Sell):** `vendor@example.com` / `password123`
- **Admin (Superuser):** `admin@example.com` / `password123`

---

## Tech Stack

- **Frontend:** React 18.2.0, Vite 6.2.0, Tailwind CSS 3.3.5, React Router 7.5.0
- **Backend:** Node.js, Express 4.18.2, Mongoose 7.5.3, JWT Authentication
- **Database:** MongoDB Atlas
- **Payment Processing:** Stripe API
- **Image Uploads:** Cloudinary

---

## Local Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or MongoDB Atlas connection string)
- Git

### Application Setup

```bash
# Clone repository
git clone https://github.com/Mohityadav55199/ShopVerse.git
cd ShopVerse

# Backend setup
cd server
npm install
cp .env.example .env

# Frontend setup
cd ../client
npm install
```

### Environment Variables Configuration

Update the `.env` file in the `server` directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shopverse
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Application

```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from client directory)
npm run dev
```

Access locally:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## Features Overview

1. **3-Tier Role System**:
   - **Customer**: Browse products, search, add to cart, checkout.
   - **Vendor**: Manage store inventory, list new products, update stock.
   - **Admin**: System metrics, user role management, order management.
2. **1-Click Quick Demo Accounts**: Pre-filled test profiles on the login screen for instant evaluation.
3. **Responsive Mobile-First UI**: Tailwind CSS responsive design across desktop, tablet, and mobile.

---

## License

[IIIT License](LICENSE) © 2026 Mohit Yadav