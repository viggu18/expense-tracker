# Style Guide

## Overview

This document provides coding standards and style guidelines for the Splitter application to ensure consistency and maintainability across the codebase.

## General Principles

### Readability

- Code should be self-documenting
- Use descriptive variable and function names
- Keep functions and components small and focused
- Write comments to explain "why" not "what"

### Consistency

- Follow established patterns in the codebase
- Maintain consistent naming conventions
- Use consistent formatting and indentation
- Apply consistent error handling

### Maintainability

- Write modular, reusable code
- Minimize dependencies between modules
- Keep business logic separate from UI logic
- Use TypeScript for type safety

## Backend Style Guide

### TypeScript

#### File Structure

```typescript
// src/controllers/user.controller.ts

// 1. Imports (standard library, third-party, local)
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import User from '@/models/User';
import { AppError } from '@/middleware/error.middleware';

// 2. Constants
const SALT_ROUNDS = 12;

// 3. Types and interfaces
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

// 4. Main exports
export const createUser = async (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Implementation
  } catch (error) {
    next(error);
  }
};

// 5. Helper functions
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// 6. Default export (if needed)
export default {
  createUser
};
```

#### Naming Conventions

```typescript
// ✅ Good: Descriptive names
const getUserById = async (id: string) => { /* ... */ };
const calculateGroupBalances = (groupId: string) => { /* ... */ };
const MAX_LOGIN_ATTEMPTS = 5;

// ❌ Bad: Unclear names
const get = async (id: string) => { /* ... */ };
const calc = (groupId: string) => { /* ... */ };
const MAX = 5;
```

#### Type Safety

```typescript
// ✅ Good: Strong typing
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  // Implementation
};

// ❌ Bad: Weak typing
const createUser = async (userData: any): Promise<any> => {
  // Implementation
};
```

#### Error Handling

```typescript
// ✅ Good: Proper error handling
import { AppError } from '@/middleware/error.middleware';

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    res.json({ status: 'success', data: { user } });
  } catch (error) {
    next(new AppError('Failed to fetch user', 500));
  }
};

// ❌ Bad: Poor error handling
export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  
  res.json({ user });
};
```

### Express.js

#### Route Handlers

```typescript
// ✅ Good: Consistent response format
export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await Expense.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: { expense }
    });
  } catch (error) {
    next(error);
  }
};

// ❌ Bad: Inconsistent response format
export const createExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.create(req.body);
    
    res.json(expense); // Missing status and structure
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### Middleware

```typescript
// ✅ Good: Well-structured middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new AppError('Authentication required', 401));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = await User.findById(decoded.id);
    
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};

// ❌ Bad: Poorly structured middleware
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Frontend Style Guide

### React Native / Expo

#### Component Structure

```tsx
// src/components/ExpenseItem.tsx

// 1. Imports
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// 2. Types
interface ExpenseItemProps {
  expense: {
    id: string;
    description: string;
    amount: number;
    paidBy: string;
    date: Date;
  };
  onPress: (id: string) => void;
}

// 3. Component
const ExpenseItem = memo(({ expense, onPress }: ExpenseItemProps) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(expense.id)}
    >
      <View style={styles.content}>
        <Text style={styles.description}>{expense.description}</Text>
        <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
      </View>
      <Text style={styles.date}>
        {new Date(expense.date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
});

// 4. Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  date: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
});

// 5. Export
export default ExpenseItem;
```

#### Hooks

```tsx
// ✅ Good: Custom hook with proper typing
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

interface UseExpensesReturn {
  expenses: Expense[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const useExpenses = (groupId: string): UseExpensesReturn => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getGroupExpenses(groupId);
      setExpenses(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [groupId])
  );
  
  const refresh = useCallback(async () => {
    await fetchExpenses();
  }, [groupId]);
  
  return { expenses, loading, error, refresh };
};

// ❌ Bad: Poorly typed hook
const useExpenses = (groupId) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Implementation without proper typing
};
```

#### State Management

```tsx
// ✅ Good: Zustand store with proper typing
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (credentials) => {
        try {
          const response = await authService.login(credentials);
          set({ 
            user: response.data.user,
            isAuthenticated: true 
          });
        } catch (error) {
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      refreshUser: async () => {
        try {
          const response = await authService.getMe();
          set({ user: response.data.user });
        } catch (error) {
          get().logout();
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// ❌ Bad: Poorly structured state management
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  // Implementation without proper typing or structure
}));
```

### Styling

#### StyleSheet

```tsx
// ✅ Good: Well-organized styles
const styles = StyleSheet.create({
  // Container styles first
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  
  // Header styles
  header: {
    backgroundColor: '#007AFF',
    padding: 16,
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  
  // Content styles
  content: {
    padding: 16,
  },
  
  // Component-specific styles
  expenseItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

// ❌ Bad: Disorganized styles
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  item: {
    padding: 16,
  },
  // Styles not grouped logically
});
```

## Code Organization

### Backend Directory Structure

```
src/
├── controllers/     # Request handlers
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Custom middleware
├── services/       # Business logic
├── utils/          # Utility functions
├── types/          # TypeScript types
└── server.ts       # Main server file
```

### Frontend Directory Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── hooks/          # Custom hooks
├── services/       # API service layer
├── utils/          # Utility functions
├── store/          # State management
├── types/          # TypeScript types
├── assets/         # Images, fonts, etc.
└── App.tsx         # Main app component
```

## Naming Conventions

### Files

- Use kebab-case for file names: `user-controller.ts`, `expense-item.tsx`
- Use PascalCase for component files: `ExpenseItem.tsx`, `LoginScreen.tsx`
- Use camelCase for utility files: `format-utils.ts`, `api-client.ts`

### Variables and Functions

- Use camelCase for variables and functions: `getUserById`, `totalAmount`
- Use UPPER_SNAKE_CASE for constants: `MAX_LOGIN_ATTEMPTS`, `API_BASE_URL`
- Use descriptive names: `calculateGroupBalances` instead of `calc`

### Classes and Components

- Use PascalCase for classes and components: `UserModel`, `ExpenseItem`
- Use descriptive names that indicate purpose: `ExpenseForm` instead of `Form`

### Interfaces and Types

- Use PascalCase with `I` prefix for interfaces: `IUser`, `IExpense`
- Use PascalCase for type aliases: `UserType`, `ExpenseStatus`

## Documentation

### Comments

```typescript
// ✅ Good: Explain why, not what
/**
 * Calculate group balances using the Dutch algorithm
 * This ensures fair distribution of expenses among group members
 */
const calculateGroupBalances = (groupId: string) => {
  // Implementation
};

// ❌ Bad: State the obvious
/**
 * Get user by ID
 */
const getUserById = (id: string) => {
  // Implementation
};
```

### JSDoc

```typescript
/**
 * Create a new expense in the database
 * @param expenseData - The expense data to create
 * @param expenseData.description - Description of the expense
 * @param expenseData.amount - Amount of the expense
 * @param expenseData.paidBy - User ID who paid for the expense
 * @returns The created expense object
 * @throws {AppError} If expense data is invalid
 */
export const createExpense = async (expenseData: CreateExpenseData) => {
  // Implementation
};
```

## Testing

### Test Structure

```typescript
// ✅ Good: Well-structured tests
import { createUser, getUserById } from '../src/controllers/user.controller';

describe('User Controller', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Test implementation
    });
    
    it('should return 400 for invalid email', async () => {
      // Test implementation
    });
    
    it('should hash the password before saving', async () => {
      // Test implementation
    });
  });
  
  describe('getUserById', () => {
    it('should return user data for valid ID', async () => {
      // Test implementation
    });
    
    it('should return 404 for non-existent user', async () => {
      // Test implementation
    });
  });
});

// ❌ Bad: Poorly structured tests
describe('User tests', () => {
  it('should work', async () => {
    // Unclear what is being tested
  });
});
```

## Git Workflow

### Commit Messages

Follow the conventional commit format:

```
type(scope): description

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add JWT authentication
fix(expense): correct calculation error
docs(readme): update setup instructions
```

### Branch Naming

- Use descriptive names: `feat/add-offline-support`, `fix/login-bug`
- Include issue number when applicable: `feat/123-add-analytics`
- Use kebab-case: `refactor/user-controller`

## Code Review Guidelines

### Review Checklist

1. **Functionality**
   - [ ] Code works as expected
   - [ ] Edge cases are handled
   - [ ] Error handling is appropriate

2. **Code Quality**
   - [ ] Follows style guide
   - [ ] Naming is clear and consistent
   - [ ] Code is well-organized

3. **Testing**
   - [ ] Adequate test coverage
   - [ ] Tests are meaningful
   - [ ] Edge cases are tested

4. **Documentation**
   - [ ] Code is self-documenting
   - [ ] Complex logic is explained
   - [ ] API changes are documented

## Tools and Configuration

### ESLint

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@react-native-community',
    '@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-console': 'warn'
  }
};
```

### Prettier

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Performance Considerations

### Backend

- Use database indexing for frequently queried fields
- Implement pagination for large datasets
- Use caching for expensive operations
- Optimize database queries

### Frontend

- Use React.memo for components
- Implement virtualized lists for large datasets
- Optimize images and assets
- Minimize re-renders

## Security Considerations

### Backend

- Validate and sanitize all inputs
- Use parameterized queries
- Implement proper authentication
- Sanitize output to prevent XSS

### Frontend

- Validate data before sending to backend
- Sanitize user inputs before display
- Use secure storage for sensitive data
- Implement proper session management

## Accessibility

- Use semantic HTML/React Native components
- Provide proper accessibility labels
- Ensure sufficient color contrast
- Support keyboard navigation

## Internationalization

- Use translation keys instead of hardcoded strings
- Support RTL languages
- Consider text length variations
- Test with different locales

## Updates

This style guide will be reviewed and updated quarterly or as needed based on:
- New language features and best practices
- Team feedback and suggestions
- Changes in project requirements
- Industry standards and guidelines