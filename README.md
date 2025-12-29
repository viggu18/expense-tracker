# Splitter - Expense Sharing Application

Splitter is a full-stack expense-sharing application similar to Splitwise, built with React Native (Expo) for the frontend and Express.js with MongoDB for the backend.

## Features

- Email/password authentication with JWT-based cloud sync
- Persistent login sessions
- Group functionality for shared expenses
- Unequal expense splitting with custom amounts
- Automatic balance calculations
- "Settle Up" functionality for payments
- Detailed analytics with charts
- Global dashboard with overall balances
- Friend management and activity history
- Modern UI with dark mode support
- Offline caching and sync

## Project Structure

```
expense-tracker/
├── splitter-app/          # React Native Expo frontend
└── splitter-backend/      # Express.js TypeScript backend
```

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React Native with Expo
- TypeScript
- React Navigation
- Axios for API calls
- Zustand for state management
- AsyncStorage for offline caching
- react-native-chart-kit for data visualization

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Expo CLI (for frontend development)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd splitter-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd splitter-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/friends` - Add friend
- `DELETE /api/users/:id/friends/:friendId` - Remove friend

### Groups
- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get all groups for user
- `GET /api/groups/:id` - Get group by ID
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add member to group
- `DELETE /api/groups/:id/members/:userId` - Remove member from group

### Expenses
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses` - Get all expenses for user (global view)
- `GET /api/expenses/group/:groupId` - Get expenses by group
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Balances
- `GET /api/balances` - Get user's balances across all groups
- `GET /api/balances/group/:groupId` - Get user's balances for a specific group

### Settlements
- `POST /api/settlements` - Create a new settlement
- `GET /api/settlements` - Get all settlements for user
- `GET /api/settlements/group/:groupId` - Get settlements by group
- `GET /api/settlements/:id` - Get settlement by ID
- `PUT /api/settlements/:id` - Update settlement
- `DELETE /api/settlements/:id` - Delete settlement

### Analytics
- `GET /api/analytics` - Get global analytics across all groups
- `GET /api/analytics/group/:groupId` - Get analytics for a specific group

## Data Models

### User
- name: String
- email: String (unique)
- password: String (hashed)
- friends: Array of User references
- createdAt: Date
- updatedAt: Date

### Group
- name: String
- description: String
- members: Array of User references
- admins: Array of User references
- createdAt: Date
- updatedAt: Date

### Expense
- description: String
- amount: Number
- paidBy: User reference
- group: Group reference
- splits: Array of { user: User reference, amount: Number }
- category: String
- date: Date
- createdAt: Date
- updatedAt: Date

### Settlement
- from: User reference
- to: User reference
- amount: Number
- group: Group reference
- description: String
- date: Date
- createdAt: Date
- updatedAt: Date

## Development

### Running Tests
- Backend: `cd splitter-backend && npm test`
- Frontend: `cd splitter-app && npm test`

### Linting
- Backend: `cd splitter-backend && npm run lint`
- Frontend: `cd splitter-app && npm run lint`

### Building for Production
- Backend: `cd splitter-backend && npm run build`
- Frontend: `cd splitter-app && npm run build`

## Deployment

### Docker
The application includes Docker configuration files for easy deployment:

```bash
docker-compose up -d
```

### Environment Variables
Make sure to set the following environment variables in production:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `NODE_ENV` - Set to "production"

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to Splitwise for the inspiration
- Built with React Native, Expo, Express.js, and MongoDB