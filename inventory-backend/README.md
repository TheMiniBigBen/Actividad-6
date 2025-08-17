# Inventory Management Application

## Overview
This is a mobile inventory management application designed for small and medium enterprises (PYMES). The application provides a robust backend built with Express.js and MongoDB, allowing users to manage their inventory efficiently.

## Features
- Add, update, delete, and retrieve inventory items.
- Manage product details including name, quantity, category, and QR code.
- RESTful API for seamless integration with frontend applications.

## Technologies Used
- **Backend**: Express.js
- **Database**: MongoDB
- **TypeScript**: For type safety and better development experience

## Project Structure
```
inventory-backend
├── src
│   ├── app.ts
│   ├── controllers
│   │   └── inventoryController.ts
│   ├── models
│   │   └── inventoryModel.ts
│   ├── routes
│   │   └── inventoryRoutes.ts
│   ├── services
│   │   └── inventoryService.ts
│   ├── config
│   │   └── db.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd inventory-backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Set up your MongoDB database and update the connection string in `src/config/db.ts`.
5. Start the application:
   ```
   npm start
   ```

## Usage
- The API endpoints can be accessed at `http://localhost:3000/api/inventory`.
- Use tools like Postman or cURL to interact with the API.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.