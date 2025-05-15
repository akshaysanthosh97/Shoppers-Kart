# Shopping Kart

<div align="center">
  <img src="./public/images/shopers-kart-logo.PNG" alt="Shopping Kart Logo" width="200">
  <p><em>A full-stack e-commerce application for efficient product management</em></p>
</div>

## 📋 Table of Contents

- [Project Overview](#Project-Overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)


## 🔍 Project-Overview

Shopping Kart is a comprehensive full-stack e-commerce application designed to efficiently manage products, categories, and inventory. It provides an intuitive interface for administrators to add, edit, and delete products, as well as manage stock levels. The application features both admin and user interfaces, allowing for complete e-commerce functionality.

The project is built with a focus on usability, performance, and scalability, making it suitable for small to medium-sized online stores.

## ✨ Features

### Admin Dashboard
- **Comprehensive Analytics**: Real-time dashboard showing total products, users, orders, and revenue statistics
- **Product Management**: Add, edit, and delete products with image upload support
- **Order Management**: View and process customer orders with status tracking
- **User Management**: Monitor and manage user accounts
- **Sales Analytics**: Track revenue and order statistics

### User Interface
- **Product Browsing**: Browse products with search functionality
- **User Authentication**: Secure login and registration with session management
- **Shopping Cart**: Add/remove products, update quantities, and persistent cart storage
- **Wishlist**: Save favorite products for later
- **Order Tracking**: View order history and status
- **User Profile**: Manage account details and preferences

### Shopping Features
- **Cart Management**: Real-time cart updates and total calculation
- **Checkout Process**: Streamlined checkout with shipping information
- **Order History**: Detailed order tracking with status updates
- **Wishlist Management**: Add/remove products from wishlist
- **Search Functionality**: Search products across the catalog

## 🛠️ Technology Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **Handlebars (HBS)**: Template engine for dynamic content

### Frontend
- **Bootstrap**: Responsive UI framework
- **CSS**: Custom styling
- **JavaScript**: Client-side functionality

### Development Tools
- **Nodemon**: Automatic server restart during development
- **Express-fileupload**: File upload middleware

## 📁 Project Structure

```
shopping-kart/
├── .gitignore               # Git ignore file
├── README.md                # Project documentation
├── app.js                   # Express application setup
├── bin/
│   └── www                  # Application entry point
├── config/
│   ├── collection.js        # MongoDB collection names
│   └── connection.js        # MongoDB connection setup
├── database-setup.md        # Instructions for database setup
├── helpers/
│   ├── order-helpers.js     # Helper functions for order management
│   ├── product-helpers.js   # Helper functions for product management
│   ├── user-helpers-wishlist.js # Helper functions for user wishlist (likely merged or old)
│   └── user-helpers.js      # Helper functions for user management
├── models/                  # Database models (currently empty or not listed in detail)
├── package-lock.json        # Exact versions of dependencies
├── package.json             # Project dependencies and scripts
├── public/
│   ├── images/              # Static image assets (logos, placeholders)
│   ├── javascripts/         # Client-side JavaScript files
│   ├── product-images/      # Uploaded product images
│   └── stylesheets/         # CSS files for styling
├── routes/
│   ├── about.js             # Routes for the About page
│   ├── account.js           # Routes for user account management
│   ├── admin.js             # Admin panel routes
│   ├── cart.js              # Shopping cart routes
│   ├── checkout.js          # Checkout process routes
│   ├── index.js             # Main application routes (homepage, search)
│   ├── orders.js            # User order management routes
│   ├── users.js             # User authentication and profile routes
│   └── wishlist.js          # Wishlist management routes
├── views/
│   ├── about.hbs            # About page template
│   ├── admin/               # Admin panel views
│   │   ├── admin-dashboard.hbs
│   │   ├── admin-orders.hbs
│   │   ├── admin-product-edit.hbs
│   │   ├── admin-product-new.hbs
│   │   ├── admin-products.hbs
│   │   ├── admin-sales.hbs
│   │   └── admin-users.hbs
│   ├── error.hbs            # Error page template
│   ├── index.hbs            # Home page template
│   ├── layout.hbs           # Main layout template
│   ├── partials/            # Reusable view components (navbar, footer, product cards)
│   │   ├── footer.hbs
│   │   ├── navbar.hbs
│   │   └── product-card.hbs
│   ├── search-results.hbs   # Search results page template
│   └── user/                # User-specific views
│       ├── account.hbs
│       ├── cart.hbs
│       ├── checkout.hbs
│       ├── login.hbs
│       ├── order-confirmation.hbs
│       ├── order-details.hbs
│       ├── signup.hbs
│       ├── user-index.hbs   # User dashboard/main page (potentially)
│       └── wishlist.hbs
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shopping-kart.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd shopping-kart
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## 📖 Usage Guide

### Admin Interface

1. **Accessing the Admin Dashboard**
   - Navigate to `/admin/dashboard`
   - View key metrics including total products, users, orders, and revenue

2. **Managing Products**
   - Go to `/admin/products` to view all products
   - Use the "Add New Product" button to create a new product listing
   - Edit or delete existing products from the products management page

3. **Adding a New Product**
   - Click "Add New Product" on the products page
   - Fill in the product details (name, description, price, etc.)
   - Upload product images
   - Select a category
   - Set inventory levels
   - Click "Save" to add the product

### User Interface

1. **Browsing Products**
   - Visit the homepage to see featured products
   - Use the navigation menu to browse by category
   - Use the search bar to find specific products

2. **Viewing Product Details**
   - Click on a product to view its details
   - See product description, price, and availability

## 📡 API Documentation

### Admin Routes

- `GET /admin/dashboard` - View admin dashboard with key metrics
- `GET /admin/products` - View all products
- `GET /admin/search-products` - Search products (AJAX endpoint)
- `GET /admin/products/new` - Display form to add a new product
- `POST /admin/products` - Create a new product
- `GET /admin/products/:id/edit` - Display form to edit an existing product
- `PUT /admin/products/:id` - Update an existing product
- `DELETE /admin/products/:id` - Delete a product
- `GET /admin/users` - View all registered users
- `GET /admin/orders` - View all customer orders
- `GET /admin/sales` - View sales reports and analytics

### User Routes

- `GET /` - Homepage, displays products
- `GET /search` - Search for products
- `GET /users/login` - Display user login page
- `POST /users/login` - Handle user login attempt
- `GET /users/signup` - Display user signup page
- `POST /users/signup` - Handle user registration attempt
- `GET /users/logout` - Log out the current user
- `GET /users/user-index` - Display products for logged-in users (main user view)
- `GET /cart` - View shopping cart (supports guest and logged-in users)
- `POST /cart/api/update-quantity` - API to update product quantity in cart
- `GET /cart/api/cart-count` - API to get current cart item count
- `GET /cart/get-cart-items` - API to get cart items (e.g., for checkout)
- `GET /checkout` - Display checkout page
- `POST /checkout/place-order` - Place a new order
- `GET /orders` - View current user's order history
- `GET /orders/:orderId` - View details of a specific order
- `GET /wishlist` - View user's wishlist
- `POST /wishlist/add` - Add a product to the wishlist
- `POST /wishlist/remove` - Remove a product from the wishlist
- `GET /account` - View user account details page
- `POST /account/update-profile` - Update user profile information
- `POST /account/update-settings` - Update user account settings (e.g., password)
- `GET /about` - Display the About Us page

### API (Utility Endpoints for Client-Side)

- `GET /cart/api/products/:id` - Get product details (used for guest cart functionality)

## 💾 Database Schema

Collections are managed in MongoDB. `ObjectId` is used for `_id` fields by default.

### `products` Collection
- `_id`: ObjectId (Primary Key)
- `name`: String (Product name)
- `description`: String (Detailed product description)
- `price`: Number (Regular price of the product)
- `category`: String (Category name, e.g., "Electronics", "Books")
- `image`: String (Path to the product image, e.g., `/product-images/<productId>.jpg`)
- `badge`: String (Optional, e.g., "New", "Sale", "Featured")
- `stock`: Number (Current inventory level - *Note: Stock tracking logic might need further implementation based on current helpers*)
- `createdAt`: Date (Timestamp of product creation, automatically managed)
- `updatedAt`: Date (Timestamp of last product update, automatically managed)

### `users` Collection
- `_id`: ObjectId (Primary Key)
- `name`: String (User's full name)
- `email`: String (User's email address, unique)
- `phone`: String (User's phone number, optional)
- `password`: String (Hashed password)
- `role`: String (User role, e.g., `user`, `admin`)
- `isActive`: Boolean (Indicates if the user account is active or blocked, default: `true`)
- `notifications`: Boolean (User preference for receiving notifications, optional)
- `createdAt`: Date (Timestamp of user registration)
- `updatedAt`: Date (Timestamp of last profile update)

### `cart` Collection
- `_id`: ObjectId (Primary Key)
- `user`: ObjectId (References `users._id`)
- `products`: Array of Objects
  - `item`: ObjectId (References `products._id`)
  - `quantity`: Number
- `createdAt`: Date (Timestamp of cart creation)
- `updatedAt`: Date (Timestamp of last cart modification)

### `wishlist` Collection
- `_id`: ObjectId (Primary Key)
- `user`: ObjectId (References `users._id`)
- `products`: Array of ObjectId (Each ObjectId references `products._id`)
- `createdAt`: Date (Timestamp of wishlist creation)
- `updatedAt`: Date (Timestamp of last wishlist modification)

### `orders` Collection
- `_id`: ObjectId (Primary Key)
- `userId`: ObjectId (References `users._id`)
- `products`: Array of Objects
  - `item`: ObjectId (References `products._id`)
  - `quantity`: Number
  - `price`: Number (Price of the product at the time of order)
- `shippingAddress`: Object
  - `name`: String
  - `address`: String
  - `city`: String
  - `state`: String
  - `zip`: String
  - `country`: String
- `paymentMethod`: String (e.g., "Card", "COD")
- `total`: Number (Total order amount, including shipping and taxes if any)
- `status`: String (e.g., "Pending", "Placed", "Processing", "Shipped", "Delivered", "Cancelled")
- `date`: Date (Timestamp of order placement)
- `updatedAt`: Date (Timestamp of last order status update)

## 🌐 Deployment

### Prerequisites
- Node.js hosting environment
- MongoDB database (for production)

### Deployment Steps

1. **Prepare for production**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   - `NODE_ENV=production`
   - `PORT=your_port`
   - `DB_URI=your_database_uri`

3. **Start the application**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes with a descriptive message
   ```bash
   git commit -m "Add feature: your feature description"
   ```
4. Push your changes to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a pull request to the main repository

### Coding Standards
- Follow the existing code style
- Write clear, descriptive commit messages
- Include comments where necessary
- Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>Made with ❤️ by AKSHAY SANTHOSH</p>
</div>
