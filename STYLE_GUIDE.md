# Style Guide

This document provides coding standards and style guidelines for the Splitter application development.

## Table of Contents

1. [General Principles](#general-principles)
2. [Naming Conventions](#naming-conventions)
3. [Code Structure](#code-structure)
4. [Comments and Documentation](#comments-and-documentation)
5. [TypeScript Guidelines](#typescript-guidelines)
6. [React/React Native Guidelines](#reactreact-native-guidelines)
7. [Backend Guidelines](#backend-guidelines)
8. [Testing Guidelines](#testing-guidelines)
9. [Git Workflow](#git-workflow)
10. [Code Review Process](#code-review-process)

## General Principles

### Readability First

Code is read more often than it is written. Prioritize clarity over cleverness:

```typescript
// Good - Clear and readable
const calculateTotalAmount = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Avoid - Clever but hard to understand
const calcTotal = (exps: Expense[]): number => exps.reduce((t, e) => t + e.amount, 0);
```

### Consistency

Maintain consistency within the codebase:

- Follow established patterns
- Use consistent formatting
- Maintain uniform naming conventions
- Apply consistent error handling

### Single Responsibility

Each function, class, and module should have one clear purpose:

```typescript
// Good - Single responsibility
class ExpenseValidator {
  static validateAmount(amount: number): boolean {
    return amount > 0 && amount < 1000000;
  }
  
  static validateDescription(description: string): boolean {
    return description.length > 0 && description.length <= 100;
  }
}

// Avoid - Multiple responsibilities
class ExpenseManager {
  validateAmount(amount: number): boolean { /* ... */ }
  validateDescription(description: string): boolean { /* ... */ }
  saveExpense(expense: Expense): Promise<void> { /* ... */ }
  sendNotification(expense: Expense): void { /* ... */ }
}
```

## Naming Conventions

### Variables and Functions

Use descriptive names that clearly indicate purpose:

```typescript
// Good
const userExpenses: Expense[] = [];
const calculateTotalAmount = (expenses: Expense[]): number => { /* ... */ };
const isValidEmail = (email: string): boolean => { /* ... */ };

// Avoid
const data: Expense[] = [];
const calc = (exps: Expense[]): number => { /* ... */ };
const check = (email: string): boolean => { /* ... */ };
```

### Booleans

Prefix boolean variables with `is`, `has`, `can`, or `should`:

```typescript
// Good
const isAuthenticated = true;
const hasPermission = false;
const canEdit = true;
const shouldRefresh = false;

// Avoid
const auth = true;
const perm = false;
const edit = true;
const refresh = false;
```

### Constants

Use UPPER_SNAKE_CASE for constants:

```typescript
// Good
const MAX_EXPENSE_AMOUNT = 1000000;
const DEFAULT_CURRENCY = 'USD';
const API_BASE_URL = 'https://api.splitter.app';

// Avoid
const maxExpenseAmount = 1000000;
const defaultCurrency = 'USD';
```

### Classes and Interfaces

Use PascalCase for classes and interfaces:

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

class ExpenseService {
  // ...
}

// Avoid
interface user {
  // ...
}

class expenseService {
  // ...
}
```

### Files and Folders

Use kebab-case for file and folder names:

```
// Good
src/
├── components/
│   ├── expense-item.tsx
│   ├── group-card.tsx
│   └── user-avatar.tsx
├── services/
│   ├── auth.service.ts
│   ├── expense.service.ts
│   └── group.service.ts
└── utils/
    ├── format.utils.ts
    └── validation.utils.ts

// Avoid
src/
├── Components/
│   ├── ExpenseItem.tsx
│   ├── GroupCard.tsx
│   └── UserAvatar.tsx
```

## Code Structure

### File Organization

Organize files logically by feature or domain:

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── expense/            # Expense-related components
│   │   ├── expense-form.tsx
│   │   └── expense-list.tsx
│   └── group/              # Group-related components
│       ├── group-form.tsx
│       └── group-list.tsx
├── screens/                # Application screens
│   ├── login.screen.tsx
│   ├── dashboard.screen.tsx
│   └── expenses.screen.tsx
├── services/               # Business logic services
│   ├── auth.service.ts
│   ├── expense.service.ts
│   └── group.service.ts
├── store/                  # State management
│   ├── auth.store.ts
│   └── expense.store.ts
├── hooks/                  # Custom hooks
│   ├── use-auth.ts
│   └── use-expenses.ts
├── utils/                  # Utility functions
│   ├── format.ts
│   └── validation.ts
└── types/                  # Type definitions
    ├── expense.types.ts
    └── user.types.ts
```

### Import Organization

Organize imports in the following order:

1. External libraries
2. Internal modules
3. Relative imports
4. Type imports

```typescript
// Good
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Expense } from '@/types/expense.types';
import { formatCurrency } from '@/utils/format';

import { styles } from './expense-item.styles';
import type { ExpenseItemProps } from './expense-item.types';
```

### Function Length

Keep functions small and focused:

```typescript
// Good - Single responsibility
const validateExpense = (expense: Expense): boolean => {
  return (
    validateAmount(expense.amount) &&
    validateDescription(expense.description) &&
    validateParticipants(expense.participants)
  );
};

// Avoid - Multiple responsibilities
const processExpense = (expense: Expense): boolean => {
  // Validation logic
  if (expense.amount <= 0) return false;
  if (!expense.description) return false;
  
  // Database logic
  const db = getDatabase();
  db.insert('expenses', expense);
  
  // Notification logic
  sendNotification('Expense created');
  
  // Analytics logic
  trackEvent('expense_created');
  
  return true;
};
```

## Comments and Documentation

### Inline Comments

Use inline comments sparingly and only when necessary:

```typescript
// Good - Explaining complex logic
const calculateBalances = (expenses: Expense[]): Balance[] => {
  // Using a map to efficiently track balances by user ID
  const balanceMap = new Map<string, number>();
  
  expenses.forEach(expense => {
    // Add amount to payer's balance
    const currentBalance = balanceMap.get(expense.paidBy) || 0;
    balanceMap.set(expense.paidBy, currentBalance + expense.amount);
    
    // Subtract share from each participant
    expense.participants.forEach(participant => {
      const currentBalance = balanceMap.get(participant.userId) || 0;
      balanceMap.set(participant.userId, currentBalance - participant.amount);
    });
  });
  
  return Array.from(balanceMap.entries()).map(([userId, amount]) => ({
    userId,
    amount
  }));
};

// Avoid - Stating the obvious
const add = (a: number, b: number): number => {
  // Add a and b together
  return a + b;
};
```

### Function Documentation

Document complex functions with JSDoc:

```typescript
/**
 * Calculates the balances between users based on expenses
 * 
 * @param expenses - Array of expenses to calculate balances from
 * @returns Array of balances showing who owes whom
 * 
 * @example
 * ```typescript
 * const expenses = [
 *   { paidBy: 'user1', amount: 100, participants: [{ userId: 'user2', amount: 50 }] }
 * ];
 * const balances = calculateBalances(expenses);
 * // Returns: [{ from: 'user2', to: 'user1', amount: 50 }]
 * ```
 */
const calculateBalances = (expenses: Expense[]): Balance[] => {
  // Implementation
};
```

### TODO Comments

Use TODO comments for planned work:

```typescript
// TODO: Implement proper error handling
// TODO(john): Add unit tests for this function
// FIXME: This is a temporary workaround
// HACK: This needs to be refactored
```

## TypeScript Guidelines

### Type Safety

Always use explicit types:

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

const getUser = async (id: string): Promise<User | null> => {
  // Implementation
};

// Avoid
const getUser = async (id) => {
  // Implementation
};
```

### Interface vs Type

Use interfaces for object shapes, types for unions and primitives:

```typescript
// Good - Interface for object shape
interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  participants: Participant[];
}

// Good - Type for union
type ExpenseStatus = 'pending' | 'approved' | 'rejected';

// Good - Type for primitive
type CurrencyCode = string;
```

### Optional Properties

Use optional properties appropriately:

```typescript
// Good
interface CreateExpenseInput {
  description: string;
  amount: number;
  paidBy: string;
  groupId?: string; // Optional
  category?: string; // Optional
}

// Avoid - Making everything optional when not needed
interface CreateExpenseInput {
  description?: string;
  amount?: number;
  paidBy?: string;
  groupId?: string;
  category?: string;
}
```

### Generics

Use generics for reusable, type-safe functions:

```typescript
// Good
const useApi = <T>(endpoint: string): { data: T | null; loading: boolean; error: string | null } => {
  // Implementation
};

// Usage
const { data: expenses, loading, error } = useApi<Expense[]>('/expenses');
```

## React/React Native Guidelines

### Component Structure

Follow a consistent component structure:

```typescript
// Good
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExpenseItemProps {
  expense: Expense;
  onPress: () => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onPress }) => {
  const [isSelected, setIsSelected] = useState(false);
  
  useEffect(() => {
    // Side effects
  }, []);
  
  const handlePress = () => {
    setIsSelected(!isSelected);
    onPress();
  };
  
  return (
    <View style={[styles.container, isSelected && styles.selected]}>
      <Text style={styles.description}>{expense.description}</Text>
      <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  selected: {
    backgroundColor: '#f0f0f0',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
});

export default ExpenseItem;
```

### Hooks

Use hooks for state and side effects:

```typescript
// Good
const useExpenses = (groupId?: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const data = await expenseService.getByGroup(groupId);
        setExpenses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, [groupId]);
  
  return { expenses, loading, error };
};

// Avoid - Class components for simple state
class ExpenseList extends React.Component {
  state = { expenses: [], loading: true };
  
  componentDidMount() {
    // Fetch expenses
  }
  
  render() {
    // Render logic
  }
}
```

### Performance Optimization

Optimize components for performance:

```typescript
// Good - Memoize expensive calculations
const ExpenseSummary: React.FC<{ expenses: Expense[] }> = React.memo(({ expenses }) => {
  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);
  
  return (
    <View>
      <Text>Total: {formatCurrency(totalAmount)}</Text>
    </View>
  );
});

// Good - Use React.memo for pure components
const ExpenseItem = React.memo(({ expense }: { expense: Expense }) => {
  return (
    <View>
      <Text>{expense.description}</Text>
      <Text>{formatCurrency(expense.amount)}</Text>
    </View>
  );
});
```

## Backend Guidelines

### Express.js Structure

Follow a consistent Express.js structure:

```typescript
// Good
import { Request, Response, NextFunction } from 'express';
import { Expense } from '../models/Expense';
import { validateExpense } from '../utils/validation';

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Input validation
    const validationError = validateExpense(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError
      });
    }
    
    // Business logic
    const expense = new Expense(req.body);
    await expense.save();
    
    // Response
    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    next(error);
  }
};
```

### Error Handling

Implement consistent error handling:

```typescript
// Good
class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  console.error(err);
  
  // Handle known errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }
  
  // Handle unknown errors
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};
```

### Database Operations

Use proper database operation patterns:

```typescript
// Good
class ExpenseRepository {
  async create(expenseData: CreateExpenseInput): Promise<Expense> {
    const expense = new Expense(expenseData);
    return await expense.save();
  }
  
  async findByGroup(groupId: string): Promise<Expense[]> {
    return await Expense.find({ groupId }).sort({ createdAt: -1 });
  }
  
  async update(id: string, updateData: Partial<Expense>): Promise<Expense | null> {
    return await Expense.findByIdAndUpdate(id, updateData, { new: true });
  }
  
  async delete(id: string): Promise<boolean> {
    const result = await Expense.findByIdAndDelete(id);
    return !!result;
  }
}
```

## Testing Guidelines

### Test Structure

Follow a consistent test structure:

```typescript
// Good
import { calculateBalances } from '../src/utils/balance-calculator';

describe('calculateBalances', () => {
  describe('when given valid expenses', () => {
    it('should calculate correct balances', () => {
      const expenses = [
        {
          paidBy: 'user1',
          amount: 100,
          participants: [
            { userId: 'user1', amount: 50 },
            { userId: 'user2', amount: 50 }
          ]
        }
      ];
      
      const balances = calculateBalances(expenses);
      
      expect(balances).toEqual([
        { from: 'user2', to: 'user1', amount: 50 }
      ]);
    });
  });
  
  describe('when given no expenses', () => {
    it('should return empty array', () => {
      const balances = calculateBalances([]);
      expect(balances).toEqual([]);
    });
  });
});
```

### Test Descriptions

Use clear, descriptive test names:

```typescript
// Good
it('should return true for valid email format', () => { /* ... */ });
it('should return false for invalid email format', () => { /* ... */ });
it('should throw error when email is empty', () => { /* ... */ });

// Avoid
it('should work', () => { /* ... */ });
it('should not work', () => { /* ... */ });
it('should handle edge case', () => { /* ... */ });
```

### Mocking

Use appropriate mocking strategies:

```typescript
// Good
import * as expenseService from '../src/services/expense.service';

jest.mock('../src/services/expense.service');

describe('ExpenseScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should fetch expenses on mount', async () => {
    const mockExpenses = [{ id: '1', description: 'Test' }];
    (expenseService.getAll as jest.Mock).mockResolvedValue(mockExpenses);
    
    // Test implementation
    
    expect(expenseService.getAll).toHaveBeenCalled();
  });
});
```

## Git Workflow

### Branch Naming

Use descriptive branch names:

```
# Good
feature/user-authentication
bugfix/login-error-handling
hotfix/critical-security-patch
refactor/expenses-calculation

# Avoid
feature/fix
bugfix/thing
dev
test
```

### Commit Messages

Follow conventional commit format:

```
# Good
feat(auth): add user login functionality
fix(expenses): resolve calculation error in group balances
docs(readme): update installation instructions
refactor(api): improve error handling in expense service
test(auth): add unit tests for login validation

# Avoid
fixed stuff
updated code
changes
```

### Pull Requests

Create focused pull requests:

- One feature per PR
- Clear description of changes
- Link to related issues
- Include screenshots for UI changes
- Request specific reviewers

## Code Review Process

### Review Checklist

Reviewers should check for:

1. **Functionality**
   - Does the code work as intended?
   - Are edge cases handled?
   - Is error handling appropriate?

2. **Code Quality**
   - Is the code readable and maintainable?
   - Are naming conventions followed?
   - Is there unnecessary complexity?

3. **Testing**
   - Are there adequate tests?
   - Do tests cover edge cases?
   - Are tests well-structured?

4. **Security**
   - Are there potential security vulnerabilities?
   - Is user input properly validated?
   - Are secrets handled correctly?

5. **Performance**
   - Are there performance concerns?
   - Is database usage efficient?
   - Are there memory leaks?

### Review Comments

Provide constructive feedback:

```markdown
# Good
This function is doing too many things. Consider breaking it into smaller functions with single responsibilities.

The variable name `d` is not descriptive. Consider renaming it to `description` for clarity.

This is a great approach to solving the problem! Well done.

# Avoid
This is wrong.
Bad code.
Fix this.
```

By following these style guidelines, we ensure consistent, maintainable, and high-quality code across the Splitter application.