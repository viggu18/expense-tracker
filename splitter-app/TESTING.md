# Frontend Testing Guide

This document provides guidelines and instructions for testing the Splitter frontend application.

## Testing Framework

The frontend uses Jest and React Testing Library with the following configuration:
- Unit tests for individual components and functions
- Integration tests for component interactions
- Mocking for API calls and external dependencies

## Test Structure

```
splitter-app/
├── src/
│   ├── __tests__/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
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
Unit tests focus on individual components and functions in isolation.

#### Example: Button Component Test
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../src/components/Button';

describe('Button Component', () => {
  it('should render with correct title', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={jest.fn()} />
    );
    
    expect(getByText('Click Me')).toBeTruthy();
  });
  
  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Click Me'));
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
  
  it('should be disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={onPressMock} disabled={true} />
    );
    
    const button = getByText('Click Me');
    expect(button.props.accessibilityState.disabled).toBe(true);
    
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
```

### Integration Tests
Integration tests verify that components work together correctly.

#### Example: Login Screen Test
```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useAuth } from '../src/hooks/useAuth';
import LoginScreen from '../src/screens/LoginScreen';

// Mock the useAuth hook
jest.mock('../src/hooks/useAuth');

describe('Login Screen', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: jest.fn().mockResolvedValue({}),
      loading: false,
      error: null,
    });
  });
  
  it('should render email and password inputs', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });
  
  it('should call login function when form is submitted', async () => {
    const mockLogin = jest.fn().mockResolvedValue({});
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
    });
    
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
  
  it('should show error message when login fails', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: 'Invalid credentials',
    });
    
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'wrongpassword');
    fireEvent.press(getByText('Sign In'));
    
    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy();
    });
  });
});
```

### Mocking
Use Jest's mocking capabilities to isolate the code under test.

#### Example: Mocking API Calls
```typescript
import { authService } from '../src/services/auth.service';

jest.mock('../src/services/api', () => ({
  post: jest.fn(),
}));

describe('Auth Service', () => {
  describe('login', () => {
    it('should return user data on successful login', async () => {
      const mockResponse = {
        data: {
          _id: '123',
          name: 'Test User',
          email: 'test@example.com',
          token: 'mock-token',
        },
      };
      
      (api.post as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });
      
      expect(result).toEqual(mockResponse.data);
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
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

## Component Testing

### Testing Props
- Test all possible prop combinations
- Test default prop values
- Test edge cases for prop values

### Testing User Interactions
- Test all user interaction points (buttons, inputs, etc.)
- Test keyboard navigation
- Test accessibility features

### Testing State Changes
- Test component state updates
- Test conditional rendering
- Test loading and error states

### Testing Navigation
- Test navigation between screens
- Test navigation parameters
- Test navigation guards

## Hook Testing

### Testing Custom Hooks
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '../src/hooks/useAuth';

describe('useAuth Hook', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('should set loading state during login', async () => {
    const mockLogin = jest.fn().mockImplementation(() => {
      return new Promise(resolve => setTimeout(resolve, 100));
    });
    
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.login({ email: 'test@example.com', password: 'password123' });
    });
    
    expect(result.current.loading).toBe(true);
  });
});
```

## Service Testing

### Testing API Services
- Test successful API responses
- Test error responses
- Test different HTTP methods
- Test request parameters

### Testing Utility Functions
- Test all possible input combinations
- Test edge cases
- Test error conditions
- Test return values

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
Tests use a separate environment configuration:
```env
NODE_ENV=test
API_BASE_URL=http://localhost:3001/api
```

### Mocking External Dependencies
- Mock API calls using `jest.mock`
- Mock AsyncStorage using `@react-native-async-storage/async-storage/jest/async-storage-mock`
- Mock navigation using `@react-navigation/native`

## Common Testing Scenarios

### Authentication Tests
- Test login with valid and invalid credentials
- Test registration with valid and invalid data
- Test logout functionality
- Test token persistence

### Form Validation Tests
- Test required field validation
- Test email format validation
- Test password strength validation
- Test custom validation rules

### Navigation Tests
- Test navigation between all screens
- Test deep linking
- Test navigation guards
- Test tab navigation

### State Management Tests
- Test global state updates
- Test state persistence
- Test state reset functionality
- Test derived state calculations

### UI Component Tests
- Test all component variants
- Test responsive behavior
- Test accessibility features
- Test loading and error states

## Performance Testing

For performance-critical components, consider adding performance tests:
- Test render times for complex components
- Test memory usage
- Test interaction responsiveness
- Test list rendering performance

## Accessibility Testing

- Test screen reader compatibility
- Test keyboard navigation
- Test color contrast ratios
- Test touch target sizes

## Troubleshooting

### Common Issues
1. **Async test timeouts**: Increase Jest timeout or optimize test code
2. **Mock not working**: Check that mocks are set up before the test runs
3. **Navigation not working**: Ensure navigation context is provided in tests
4. **State not updating**: Check that state updates are awaited properly

### Getting Help
1. Check existing tests for similar patterns
2. Review React Testing Library documentation
3. Consult team members
4. Review CI pipeline logs for detailed error information