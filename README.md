# Inventory-Management-System
# InventoryPro

The Inventory Management System is a full-stack web application that enables businesses to efficiently manage products, categories, suppliers, and orders. Built with modern technologies such as React, Node.js, TypeScript, MySQL, and JWT-based authentication, this system streamlines inventory operations for both administrators and users.

## Features:

### Admin:

* View key metrics: total users, products, orders, stock and status.
* Manage products (name, category, quantity, price, supplier).
* Manage categories (name, description, status).
* Manage suppliers and associate them with specific categories.
* View and manage all orders.
* Analytics with bar chart.

### User:

* Browse available products.
* Place new orders and view past orders.
* Cancel orders if needed.
* View and edit personal profile information.

## Technologies Used

### Frontend:

* React (with TypeScript)
* Vite for fast development
* External CSS for styling

### Backend:

* Node.js with TypeScript
* Express for server-side functionality
* TypeORM for database ORM
* MySQL as the database

### Authentication:

* JWT for secure login and route protection

## Installation:

* Install Node JS
* Install MySQL Database

### Steps to Install:

Clone the repository:

```
git clone "https://github.com/suba-kannan/Inventory-Management-System.git"
cd Inventory-Management-System
```

Install dependencies:

### Frontend:

```
cd frontend
npm install
```

### Backend:

```
cd backend
npm install
```

### Set up the database:

* Create a MySQL database and import the necessary schema.
* Update the database configuration in backend/src/config/data-source.ts.

## Run the Application:

### Start the Backend:
```
cd backend
npm start
```

### Start the Frontend:
```
cd frontend
npm run dev
```
The frontend will be available at http://localhost:5173, and the backend API will run at http://localhost:5000.