# Development Guide

This document provides guidelines and instructions for developing the Splitter application.

## Project Overview

Splitter is a full-stack expense-sharing application with:
- A React Native (Expo) frontend
- An Express.js (TypeScript) backend
- MongoDB as the database

## Development Environment Setup

### Prerequisites
1. Node.js (v16 or higher)
2. npm or yarn
3. MongoDB (local or cloud instance)
4. Expo CLI for frontend development
5. Git for version control

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

## Code Structure

### Backend
```
splitter-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.ts        # Entry point
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

### Frontend
```
splitter-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── services/        # API and utility services
│   ├── store/           # State management (Zustand)
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   └── assets/          # Images and other assets
├── App.tsx              # Main app component
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Development Workflow

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `release/*` - Release branches

### Git Commit Guidelines
Follow conventional commit messages:
- `feat: Add new feature`
- `fix: Fix bug`
- `docs: Update documentation`
- `style: Code formatting`
- `refactor: Code refactoring`
- `test: Add tests`
- `chore: Maintenance tasks`

### Code Quality
1. Follow TypeScript best practices
2. Use ESLint and Prettier for code formatting
3. Write unit tests for critical functionality
4. Maintain consistent naming conventions
5. Document complex logic with comments

## Testing

### Backend Testing
- Unit tests with Jest
- Integration tests for API endpoints
- Run tests with: `npm test`

### Frontend Testing
- Unit tests with Jest and React Testing Library
- Component tests
- Run tests with: `npm test`

## API Development

### Adding New Endpoints
1. Create a controller function in the appropriate controller file
2. Add the route in the corresponding routes file
3. Add validation middleware if needed
4. Update API documentation

### Error Handling
- Use centralized error handling middleware
- Return consistent error response format
- Log errors appropriately
- Handle edge cases gracefully

## Database Development

### Adding New Models
1. Create a new model file in `src/models/`
2. Define the schema with appropriate validation
3. Add indexes for frequently queried fields
4. Export the model

### Migrations
- Use Mongoose schema evolution for database changes
- Test migrations thoroughly
- Document breaking changes

## Frontend Development

### Component Development
1. Create reusable components in `src/components/`
2. Use TypeScript interfaces for props
3. Follow React best practices
4. Write stories for Storybook (if used)

### State Management
- Use Zustand for global state
- Keep component state local when possible
- Follow immutability principles

### Navigation
- Use React Navigation for screen flow
- Define types for navigation props
- Handle deep linking appropriately

## Styling

### Design System
- Use consistent color palette
- Define typography scale
- Create reusable style utilities
- Follow platform-specific guidelines

### Responsive Design
- Test on different screen sizes
- Use flexbox for layouts
- Consider orientation changes

## Performance

### Backend Performance
- Use database indexes appropriately
- Implement caching where beneficial
- Optimize database queries
- Monitor response times

### Frontend Performance
- Optimize images and assets
- Implement lazy loading
- Use memoization for expensive calculations
- Minimize re-renders

## Security

### Authentication
- Use JWT for stateless authentication
- Implement proper password hashing
- Validate tokens on protected routes
- Handle session expiration

### Data Validation
- Validate all input data
- Sanitize user inputs
- Use schema validation (Joi)
- Implement rate limiting

### API Security
- Use HTTPS in production
- Implement CORS properly
- Sanitize API responses
- Log security events

## Debugging

### Backend Debugging
- Use logging for debugging
- Implement proper error handling
- Use debugging tools (e.g., VS Code debugger)
- Monitor application logs

### Frontend Debugging
- Use React DevTools
- Implement proper error boundaries
- Use console.log judiciously
- Test on multiple devices

## Deployment

### Continuous Integration
- Run tests on every commit
- Check code quality
- Build and test deployment
- Automate releases

### Environment Configuration
- Use environment variables for configuration
- Separate configs for dev/staging/prod
- Document all environment variables
- Use .env files for local development

## Troubleshooting

### Common Issues
1. Dependency conflicts - Use `npm ci` for clean installs
2. TypeScript errors - Check tsconfig.json settings
3. Database connection issues - Verify connection string
4. Port conflicts - Change PORT environment variable

### Getting Help
1. Check existing documentation
2. Review error logs
3. Search issue tracker
4. Ask team members for assistance

## Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [React Native Documentation](https://reactnative.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [Expo DevTools](https://docs.expo.dev/workflow/development-mode/) - Expo development tools