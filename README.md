# Storynix – Full-Stack Bookstore Web Application

Storynix is a complete **bookstore web application** built with a **Node.js + Express.js backend** and a **React + TypeScript frontend**.  
It allows users to browse, purchase, and manage books, while providing admins with a secure dashboard to manage products, orders, and analytics.

---

## Features

### User Platform

- Browse and search for books with pagination and filters
- View detailed book information
- Add, update, or remove books from cart
- Checkout process with shipping and payment pages
- View order confirmation and details
- Edit profile and manage account

### Admin Dashboard

- Secure admin authentication and access control
- Dashboard with key metrics (sales, orders, users, books)
- Product management (create, edit, delete books)
- Order management (view, filter, update order status)
- Responsive and modern UI built with Tailwind CSS

---

## Tech Stack

### **Frontend**

- React + TypeScript
- Tailwind CSS

### **Backend**

- Node.js + Express.js
- TypeORM + PostgreSQL

---

## Project Structure

- **back-end/**
  - **src/**
    - **config/**
      - database.ts
      - swagger.ts
    - **controllers/**
      - authController.ts
      - bookController.ts
      - orderController.ts
      - adminController.ts
    - **entity/**
      - User.ts
      - Book.ts
      - Order.ts
      - OrderItem.ts
    - **middleware/**
      - auth.ts
    - **routes/**
      - authRoutes.ts
      - bookRoutes.ts
      - orderRoutes.ts
      - cartRoutes.ts
      - adminRoutes.ts
    - app.ts
    - server.ts
  - package.json
  - tsconfig.json
  - .env

---

- **front-end/**
  - **src/**
    - **components/**
      - Layout.tsx
      - Header.tsx
      - Footer.tsx
      - ProtectedRoute.tsx
      - **admin/**
        - AdminLayout.tsx
        - ProtectedAdminRoute.tsx
        - ProductTable.tsx
        - StatCard.tsx
    - **context/**
      - AuthContext.tsx
      - CartContext.tsx
    - **pages/**
      - HomePage.tsx
      - LoginPage.tsx
      - RegisterPage.tsx
      - CartPage.tsx
      - ProfilePage.tsx
      - EditProfilePage.tsx
      - ShippingPage.tsx
      - PaymentPage.tsx
      - OrderSuccessPage.tsx
      - **admin/**
        - AdminDashboardPage.tsx
        - AdminProductsPage.tsx
        - AdminProductFormPage.tsx
        - AdminOrdersPage.tsx
    - **api/**
      - axios.ts
    - **types/**
      - index.ts
    - App.tsx
    - index.tsx
    - main.css
  - package.json
  - tailwind.config.js
  - tsconfig.json

---

## Getting Started

### 1️- Clone the repository

```bash
git clone https://github.com/moeawad11/Storynix.git
cd Storynix
```

### 2- Backend Setup

```bash
cd back-end
npm install
```

create a .env file:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
JWT_SECRET=your_jwt_secret
```

npm run dev (to start the server, can be found at http://localhost:3000)

### 3- Frontend Setup (on a new terminal)

```bash
cd front-end
npm install
npm run dev (to start the frontend, can be found at http://localhost:5173)
```

## API Documentation

`http://localhost:5000/api/docs`
