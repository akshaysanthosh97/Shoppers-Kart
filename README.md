# Shopping Kart

<div align="center">
  <img src="./public/images/shopers-kart-logo.PNG" alt="Shopping Kart Logo" width="200">
  <p><em>A full-stack e-commerce application for efficient product management</em></p>
</div>

## 📋 Table of Contents

- [Project Overview](#project-overview)
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

## 🔍 Project Overview

Shopping Kart is a comprehensive full-stack e-commerce application designed to efficiently manage products, categories, and inventory. It provides an intuitive interface for administrators to add, edit, and delete products, as well as manage stock levels. The application features both admin and user interfaces, allowing for complete e-commerce functionality.

The project is built with a focus on usability, performance, and scalability, making it suitable for small to medium-sized online stores.

## ✨ Features

### Admin Dashboard
- **Comprehensive Analytics**: View total products, users, orders, and revenue
- **Product Management**: Add, edit, and delete products with ease
- **Category Management**: Organize products into categories
- **Inventory Tracking**: Monitor stock levels and receive low-stock alerts
- **Order Management**: Process and track customer orders

### User Interface
- **Product Browsing**: Browse products by category or search
- **Product Details**: View detailed product information
- **Responsive Design**: Optimized for all device sizes
- **User Authentication**: Secure login and registration

### Product Features
- **Image Upload**: Support for product images
- **Price Management**: Set regular and sale prices
- **Stock Tracking**: Automatic inventory updates
- **Category Assignment**: Organize products by category

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
├── bin/
│   └── www                  # Application entry point
├── public/                  # Static assets
│   ├── images/              # Image assets
│   └── stylesheets/         # CSS files
├── routes/                  # Express routes
│   ├── admin.js             # Admin routes
│   ├── index.js             # Main routes
│   └── users.js             # User routes
├── views/                   # Handlebars templates
│   ├── admin/               # Admin views
│   │   ├── admin-dashboard.hbs
│   │   ├── admin-product-new.hbs
│   │   └── admin-products.hbs
│   ├── partials/            # Reusable view components
│   │   ├── footer.hbs
│   │   ├── navbar.hbs
│   │   └── product-card.hbs
│   ├── user/                # User views
│   ├── error.hbs            # Error page
│   ├── index.hbs            # Home page
│   └── layout.hbs           # Main layout
├── app.js                   # Express application setup
├── package.json             # Project dependencies
└── README.md                # Project documentation
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

- `GET /admin/dashboard` - View admin dashboard
- `GET /admin/products` - View all products
- `GET /admin/products/new` - Add new product form
- `POST /admin/products` - Create a new product
- `GET /admin/products/:id/edit` - Edit product form
- `PUT /admin/products/:id` - Update a product
- `DELETE /admin/products/:id` - Delete a product

### User Routes

- `GET /` - Homepage
- `GET /products` - View all products
- `GET /products/:id` - View product details
- `GET /categories/:id` - View products by category

## 💾 Database Schema

### Products
- `id`: Unique identifier
- `name`: Product name
- `description`: Product description
- `price`: Regular price
- `salePrice`: Discounted price (optional)
- `category`: Product category
- `stock`: Current inventory level
- `images`: Array of image URLs
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Categories
- `id`: Unique identifier
- `name`: Category name
- `description`: Category description
- `image`: Category image URL

### Users
- `id`: Unique identifier
- `username`: User's username
- `email`: User's email address
- `password`: Hashed password
- `role`: User role (admin/customer)

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
  <p>Made with ❤️ by Your Name</p>
</div>