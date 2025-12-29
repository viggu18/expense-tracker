# Backend Testing Guide

This document provides guidelines and instructions for testing the Splitter backend application.

## Testing Framework

The backend uses Jest as the testing framework with the following configuration:
- Unit tests for individual functions and modules
- Integration tests for API endpoints
- Mocking for external dependencies (database, third-party services)

## Test Structure

```
splitter-backend/
├── src/
│   ├── __tests__/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── ...
├── jest.config.js
└── ...
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Test Categories

### Unit Tests
Unit tests focus on individual functions and modules in isolation.

#### Example: User Model Test
```typescript
import User from '../src/models/User';

describe('User Model', () => {
  describe('comparePassword', () => {
    it('should return true for correct password', async () => {
      const user = new User({ 
        name: 'Test User', 
        email: 'test@example.com', 
        password: 'password123' 
      });
      
      await user.save();
      
      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);
    });
    
    it('should return false for incorrect password', async () => {
      const user = new User({ 
        name: 'Test User', 
        email: 'test@example.com', 
        password: 'password123' 
      });
      
      await user.save();
      
      const isMatch = await user.comparePassword('wrongpassword');
      expect(isMatch).toBe(false);
    });
  });
});
```

### Integration Tests
Integration tests verify that different parts of the application work together correctly.

#### Example: Auth Controller Test
```typescript
import request from 'supertest';
import app from '../src/server';
import User from '../src/models/User';

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
        
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', userData.name);
      expect(response.body).toHaveProperty('email', userData.email);
      expect(response.body).toHaveProperty('token');
    });
    
    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123'
      };
      
      await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);
    });
  });
});
```

### Mocking
Use Jest's mocking capabilities to isolate the code under test.

#### Example: Mocking Database Calls
```typescript
import UserService from '../src/services/user.service';

jest.mock('../src/models/User');

describe('User Service', () => {
  describe('getUserById', () => {
    it('should return user data', async () => {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com'
      };
      
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      
      const user = await UserService.getUserById('123');
      
      expect(user).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith('123');
    });
  });
});
```

## Test Best Practices

### Naming Conventions
- Use descriptive test names that explain what is being tested
- Follow the "should" convention for test descriptions
- Group related tests in describe blocks

### Test Structure
- Arrange: Set up the test data and conditions
- Act: Execute the code under test
- Assert: Verify the expected outcomes

### Test Data
- Use realistic test data
- Avoid hardcoding values that might change
- Clean up test data after each test

### Assertions
- Use specific assertions rather than generic ones
- Test both positive and negative cases
- Verify error conditions

## Code Coverage

The project aims for the following coverage targets:
- Statements: 80%
- Branches: 70%
- Functions: 80%
- Lines: 80%

Run `npm run test:coverage` to generate a coverage report.

## Continuous Integration

Tests are automatically run on every commit through the CI pipeline. The pipeline will fail if:
- Any test fails
- Code coverage falls below the threshold
- Linting errors are present

## Debugging Tests

### Running Specific Tests
```bash
npm test -- -t "test description"
```

### Debugging with VS Code
1. Set breakpoints in your test files
2. Run the "Jest Current File" debug configuration
3. Inspect variables and step through code

### Logging in Tests
- Use `console.log` sparingly in tests
- Remove debug logs before committing
- Use Jest's built-in matchers for assertions

## Test Environment

### Environment Variables
Tests use a separate `.env.test` file with test-specific configuration:
```env
NODE_ENV=test
PORT=3001
MONGODB_URI=mongodb://localhost:27017/splitter_test
JWT_SECRET=test_secret_key
```

### Database Setup
- Tests use a separate test database
- Database is cleared before each test suite
- Use in-memory MongoDB for faster tests when possible

## Common Testing Scenarios

### Authentication Tests
- Test registration with valid and invalid data
- Test login with correct and incorrect credentials
- Test protected routes with and without valid tokens
- Test token expiration

### Validation Tests
- Test all validation rules for each endpoint
- Test required fields
- Test data type validation
- Test length and format constraints

### Error Handling Tests
- Test 404 responses for non-existent resources
- Test 400 responses for invalid data
- Test 401 responses for unauthorized access
- Test 500 responses for server errors

### Business Logic Tests
- Test expense splitting calculations
- Test balance calculations
- Test settlement processing
- Test group membership validation

## Performance Testing

For performance-critical endpoints, consider adding load tests:
- Test response times under normal load
- Test behavior under high load
- Monitor memory usage
- Test database query performance

## Security Testing

- Test for SQL injection (if applicable)
- Test for XSS vulnerabilities
- Test authentication and authorization
- Test input validation
- Test rate limiting

## Troubleshooting

### Common Issues
1. **Database connection errors**: Ensure MongoDB is running and connection string is correct
2. **Async test timeouts**: Increase Jest timeout or optimize test code
3. **Mock not working**: Check that mocks are set up before the test runs
4. **Environment variables not loaded**: Verify .env.test file exists and is correctly formatted

### Getting Help
1. Check existing tests for similar patterns
2. Review Jest documentation
3. Consult team members
4. Review CI pipeline logs for detailed error information