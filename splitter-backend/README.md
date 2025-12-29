# Splitter Backend - Express.js API

This is the Express.js backend for the Splitter expense sharing application.

## Features

- User authentication with JWT
- User management (friends, profiles)
- Group management (create, update, delete)
- Expense tracking with custom splits
- Balance calculations
- Settlement processing
- Analytics and reporting
- RESTful API design

## Technology Stack

- Node.js with TypeScript
- Express.js for the web framework
- MongoDB with Mongoose for data storage
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

6. Start production server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── controllers/       # Request handlers
├── middleware/        # Custom middleware
├── models/            # Mongoose models
├── routes/            # API routes
├── services/          # Business logic
├── utils/             # Utility functions
└── server.ts          # Entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/friends/:id` - Add friend
- `DELETE /api/users/friends/:id` - Remove friend

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups` - Create group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members/:memberId` - Add member to group
- `DELETE /api/groups/:id/members/:memberId` - Remove member from group

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Balances
- `GET /api/balances` - Get user balances
- `GET /api/balances/group/:groupId` - Get group balances

### Settlements
- `GET /api/settlements` - Get settlements
- `POST /api/settlements` - Create settlement
- `DELETE /api/settlements/:id` - Delete settlement

### Analytics
- `GET /api/analytics` - Get user analytics
- `GET /api/analytics/group/:groupId` - Get group analytics

## Data Models

### User
- name: String
- email: String (unique)
- password: String (hashed)
- friends: [ObjectId] (references to other users)
- createdAt: Date
- updatedAt: Date

### Group
- name: String
- description: String
- members: [ObjectId] (references to users)
- createdBy: ObjectId (reference to user)
- createdAt: Date
- updatedAt: Date

### Expense
- description: String
- amount: Number
- paidBy: ObjectId (reference to user)
- group: ObjectId (reference to group, optional)
- participants: [{
    user: ObjectId (reference to user)
    amount: Number
  }]
- category: String
- date: Date
- createdAt: Date
- updatedAt: Date

### Settlement
- from: ObjectId (reference to user)
- to: ObjectId (reference to user)
- amount: Number
- group: ObjectId (reference to group, optional)
- description: String
- date: Date
- createdAt: Date

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The API follows standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Validation

Input validation is performed using express-validator. Validation errors are returned in this format:
```json
{
  "success": false,
  "error": "Validation error message"
}
```

## Testing

To run tests:

```bash
npm test
```

## Environment Variables

- `NODE_ENV`: Environment (development, production)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: JWT expiration time

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.