# Pumpkin Cosmetics Website

A modern e-commerce storefront and admin dashboard for a skincare and cosmetics brand. The project combines a responsive React frontend with a secure Express + MongoDB backend to support product browsing, cart management, checkout, user authentication, and product administration.

Live Demo: https://pumpkin-cosmetics-website.onrender.com/

## Preview

This project includes a premium cosmetic storefront experience with hero banners, trending products, product detail pages, authentication, cart, checkout flow, and an admin panel for product and order management.

## Features

- Responsive cosmetics storefront UI
- Product listing and detailed product pages
- Shopping cart and quantity management
- Protected checkout and shipping flow
- User authentication and account management
- Email verification and password reset flow
- Order tracking and order details
- Admin dashboard for products, users, and orders
- Product creation and updates via admin tools
- Cloudinary-powered image uploads
- JWT-based user sessions with cookies

## Tech Stack

Frontend
- React 18
- Vite
- Redux Toolkit
- React Router DOM
- Material UI / Emotion
- Axios
- React Toastify

Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary
- JWT and Cookie Parser
- Nodemailer
- Express File Upload

## Project Structure

```bash
Pumpkin-Cosmetics-Website/
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── route/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Screenshots

The app includes a polished cosmetic shop aesthetic with:

- Hero banner and premium skincare branding
- Featured/trending products section
- Product cards with pricing and reviews
- Product detail view with quantity selector
- Cart and checkout experience
- Admin management screens

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB instance
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/Sahil485661/Pumpkin-Cosmetics-Website.git
cd Pumpkin-Cosmetics-Website
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
npm install --prefix frontend
```

### 4. Configure environment variables

Create a `.env` file in the backend config directory or set environment variables for the server.

Example:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Also make sure your app points to the correct config file path as used in the project.

### 5. Run the app

Start the backend:

```bash
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The frontend will run on the Vite default port (usually `http://localhost:5173`) and the backend on the configured Express port.

## Production Build

To build the frontend for production:

```bash
npm run build
```

This project is also configured to build the frontend during deployment and serve the built app from the backend.

## Deployment

This application is deployed on Render:

- Frontend / App: https://pumpkin-cosmetics-website.onrender.com/

## Admin Features

The application includes admin-only routes for:

- Product creation and editing
- Product inventory management
- User management
- Order management
- Dashboard overview

## Notes

This repository is structured as a full-stack commerce app where the Express backend serves API endpoints and the React frontend renders the storefront and dashboard.

## License

This project is for educational/demo purposes and is not currently configured with a public commercial license.

## Author

Sahil485661

