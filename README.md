# Shopping Cart Backend

## Description

The **Shopping Cart Backend** is a RESTful API built using Node.js and Express.js that facilitates the management of a shopping cart application. It allows users to add products to their cart, manage quantities, and proceed to checkout with payment integration via Razorpay. The backend connects to a MongoDB database to store product details, user information, and order history. CORS is used to enable cross-origin requests, while environment variables are managed using dotenv for better security and flexibility during development. The application is designed to handle real-time interactions with the frontend, making it suitable for e-commerce platforms.

## Features

- **Product Management:** Add, update, and remove products from the shopping cart.
- **Checkout Process:** Allows users to proceed to checkout and process payments via Razorpay.
- **Order Management:** Store user and order details after payment.
- **Environment Management:** Uses dotenv for handling environment variables.
- **MongoDB Integration:** Stores product and order data in MongoDB.
- **Cross-Origin Requests:** CORS enabled for frontend-backend interaction.

## Tech Used

- **Node.js:** JavaScript runtime for building the backend application.
- **Express.js:** Web framework for building RESTful APIs.
- **MongoDB:** NoSQL database for storing product and order information.
- **Razorpay:** Payment gateway integration for handling payments.
- **dotenv:** For managing environment variables.
- **CORS:** Middleware for enabling cross-origin requests.
- **Nodemon:** For automatic server restarts during development.

[Front-end](https://github.com/Balasaraswathi11/shoppingcart-usecontext)
