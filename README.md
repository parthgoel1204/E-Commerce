# E-Commerce SPA

A modern, full-stack e-commerce single-page application built with React, Node.js, Express, and MongoDB.

## Features

### 🛍️ Core Functionality
- **Product Catalog**: Browse products with search and category filtering
- **Shopping Cart**: Add/remove items with quantity controls
- **User Authentication**: Secure registration and login with JWT
- **Cart Persistence**: Cart data persists across sessions and login/logout
- **Responsive Design**: Modern dark theme with mobile-friendly UI

### 🔧 Technical Features
- **Real-time Search**: Search products by title and description
- **Category Filtering**: Filter by electronics, home, sports, accessories
- **Guest Cart**: Shopping cart works for non-authenticated users
- **Token Management**: Automatic JWT token handling
- **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-CommerceSPA
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

   Create `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Database Setup**
   ```bash
   cd backend
   node scripts/seedDatabase.js
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on http://localhost:5173 (or next available port)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/items` - Get all products (with optional search and category filters)
- `POST /api/items` - Create new product (admin)
- `PUT /api/items/:id` - Update product (admin)
- `DELETE /api/items/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:itemId` - Remove item from cart

## Project Structure

```
e-CommerceSPA/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   └── itemController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Item.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   └── items.js
│   ├── scripts/
│   │   └── seedDatabase.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── CategorySection.jsx
│   │   │   ├── ModernHeader.jsx
│   │   │   └── ProductGrid.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── vite.config.js
└── README.md
```
## License

This project is licensed under the MIT License.

