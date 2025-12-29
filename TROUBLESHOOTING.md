# Troubleshooting Guide

## Overview

This document provides solutions to common issues that may arise when setting up, developing, or running the Splitter application. If you encounter a problem not covered here, please check the [Support Guide](SUPPORT.md) for additional help.

## Development Environment Issues

### Node.js and npm

#### "node: command not found" or "npm: command not found"

**Problem**: Node.js or npm is not installed or not in your PATH.

**Solution**:
1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```
3. If still not found, add Node.js to your PATH:
   - **Windows**: Add `C:\Program Files\nodejs\` to your PATH environment variable
   - **macOS/Linux**: Add `export PATH="/usr/local/bin:$PATH"` to your shell profile

#### "npm ERR! peer dep missing" or "npm ERR! ERESOLVE unable to resolve dependency tree"

**Problem**: Dependency conflicts or missing peer dependencies.

**Solution**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```
3. Reinstall dependencies:
   ```bash
   npm install
   ```
4. For peer dependency issues, you may need to install missing dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### TypeScript Issues

#### "Cannot find module" or "Cannot find name"

**Problem**: Missing type definitions or incorrect imports.

**Solution**:
1. Install missing type definitions:
   ```bash
   npm install --save-dev @types/node @types/react @types/react-native
   ```
2. Check import paths are correct:
   ```typescript
   // Correct
   import User from '@/models/User';
   
   // Incorrect
   import User from '../models/User'; // May be wrong path
   ```
3. Restart TypeScript server in your IDE

#### "TS2307: Cannot find module 'express' or its corresponding type declarations"

**Problem**: Missing TypeScript definitions for dependencies.

**Solution**:
1. Install Express.js type definitions:
   ```bash
   npm install --save-dev @types/express
   ```
2. Install other missing type definitions:
   ```bash
   npm install --save-dev @types/cors @types/morgan @types/jsonwebtoken
   ```

## Backend Issues

### Database Connection

#### "MongoServerSelectionError: connect ECONNREFUSED"

**Problem**: MongoDB is not running or connection details are incorrect.

**Solution**:
1. Start MongoDB:
   ```bash
   mongod
   ```
2. Check connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/splitter
   ```
3. Verify MongoDB is listening on the correct port:
   ```bash
   netstat -an | grep 27017
   ```

#### "Authentication failed" when connecting to MongoDB

**Problem**: Incorrect database credentials.

**Solution**:
1. Check database credentials in `.env`:
   ```
   MONGODB_URI=mongodb://username:password@localhost:27017/splitter
   ```
2. Verify credentials in MongoDB:
   ```bash
   mongo -u username -p password
   ```

### Server Startup

#### "Error: listen EADDRINUSE: address already in use :::3000"

**Problem**: Another process is already using port 3000.

**Solution**:
1. Find the process using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # macOS/Linux
   lsof -i :3000
   ```
2. Kill the process:
   ```bash
   # Windows
   taskkill /PID <process_id> /F
   
   # macOS/Linux
   kill -9 <process_id>
   ```
3. Or change the port in `.env`:
   ```
   PORT=3001
   ```

#### "TypeError: Cannot read property 'split' of undefined"

**Problem**: Missing environment variables.

**Solution**:
1. Check that all required environment variables are set in `.env`:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/splitter
   JWT_SECRET=your_jwt_secret_here
   ```
2. Verify `.env` file is in the `splitter-backend` directory
3. Restart the server after making changes

### Authentication Issues

#### "jwt expired" or "invalid token"

**Problem**: JWT token has expired or is invalid.

**Solution**:
1. Clear stored tokens in the frontend:
   - For web: Clear browser localStorage/sessionStorage
   - For mobile: Clear app data or reinstall the app
2. Check JWT expiration time in auth middleware
3. Verify JWT secret matches between frontend and backend

#### "bcrypt Error: Illegal arguments: undefined"

**Problem**: Missing password in user creation.

**Solution**:
1. Ensure password is provided when creating users
2. Check that password field is not empty or undefined
3. Verify password validation in user model

## Frontend Issues

### Expo Development Server

#### "Error: EMFILE: too many open files"

**Problem**: System has too many files open.

**Solution**:
1. Increase the file descriptor limit:
   ```bash
   # macOS/Linux
   ulimit -n 65536
   ```
2. Restart the Expo development server:
   ```bash
   expo start
   ```

#### "Could not connect to development server"

**Problem**: Expo development server is not running or network issues.

**Solution**:
1. Ensure Expo server is running:
   ```bash
   cd splitter-app
   npm start
   ```
2. Check firewall settings
3. Try connecting via tunnel:
   ```bash
   expo start --tunnel
   ```
4. Restart the development server

### Build Issues

#### "Unable to resolve module" for local files

**Problem**: Incorrect import paths or module resolver issues.

**Solution**:
1. Check import paths:
   ```typescript
   // Correct
   import Button from '@/components/Button';
   
   // Incorrect
   import Button from '../../components/Button'; // May be wrong path
   ```
2. Verify `tsconfig.json` path mappings:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["src/*"],
         "@/components/*": ["src/components/*"]
       }
     }
   }
   ```
3. Restart the development server

#### "TypeError: undefined is not an object"

**Problem**: Accessing properties of undefined objects.

**Solution**:
1. Add null/undefined checks:
   ```typescript
   // Before
   const name = user.profile.name;
   
   // After
   const name = user?.profile?.name || 'Default Name';
   ```
2. Initialize state properly:
   ```typescript
   const [user, setUser] = useState<User | null>(null);
   ```

### Performance Issues

#### App is slow or freezing

**Problem**: Performance bottlenecks in the application.

**Solution**:
1. Use React DevTools Profiler to identify performance issues
2. Implement `React.memo` for components:
   ```typescript
   const ExpenseItem = memo(({ expense }: ExpenseItemProps) => {
     // Component implementation
   });
   ```
3. Use virtualized lists for large datasets:
   ```typescript
   import { FlatList } from 'react-native';
   
   <FlatList
     data={expenses}
     renderItem={({ item }) => <ExpenseItem expense={item} />}
     keyExtractor={(item) => item.id}
   />
   ```
4. Optimize images and assets
5. Minimize re-renders with proper state management

## Testing Issues

### Jest Test Failures

#### "Cannot find module" in tests

**Problem**: Incorrect module resolution in test environment.

**Solution**:
1. Check `jest.config.js` module name mapping:
   ```javascript
   module.exports = {
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/src/$1'
     }
   };
   ```
2. Mock external dependencies:
   ```typescript
   jest.mock('@react-native-async-storage/async-storage', () => ({
     getItem: jest.fn(),
     setItem: jest.fn()
   }));
   ```

#### "Async callback was not invoked within the 5000ms timeout"

**Problem**: Asynchronous operations not completing in tests.

**Solution**:
1. Increase test timeout:
   ```typescript
   test('async operation', async () => {
     // Test implementation
   }, 10000); // 10 second timeout
   ```
2. Use `act` for React state updates:
   ```typescript
   import { act } from 'react-test-renderer';
   
   await act(async () => {
     // Async operation
   });
   ```

## Deployment Issues

### Docker Deployment

#### "Cannot connect to the Docker daemon"

**Problem**: Docker is not running.

**Solution**:
1. Start Docker Desktop
2. Verify Docker is running:
   ```bash
   docker --version
   ```
3. On Linux, start Docker service:
   ```bash
   sudo systemctl start docker
   ```

#### "Bind for 0.0.0.0:3000 failed: port is already allocated"

**Problem**: Port 3000 is already in use.

**Solution**:
1. Change port mapping in `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:3000"  # Map host port 3001 to container port 3000
   ```
2. Or stop the process using port 3000

### Cloud Deployment

#### "Application error" on deployed app

**Problem**: Runtime errors in deployed environment.

**Solution**:
1. Check application logs:
   ```bash
   # Heroku
   heroku logs --tail
   
   # AWS
   aws logs tail --follow
   ```
2. Verify environment variables are set in deployment environment
3. Check that all dependencies are properly installed
4. Ensure database connection works in deployed environment

## Mobile-Specific Issues

### iOS Simulator

#### "No iOS simulators available"

**Problem**: Xcode or iOS simulator is not installed.

**Solution**:
1. Install Xcode from App Store
2. Install Xcode command line tools:
   ```bash
   xcode-select --install
   ```
3. Open Xcode and install additional components

#### "Unable to boot the Simulator"

**Problem**: iOS simulator is corrupted or has insufficient resources.

**Solution**:
1. Reset the simulator:
   ```bash
   xcrun simctl shutdown all
   xcrun simctl erase all
   ```
2. Increase simulator resources in Xcode
3. Restart Xcode and simulator

### Android Emulator

#### "No Android emulators available"

**Problem**: Android Studio or emulator is not installed.

**Solution**:
1. Install Android Studio
2. Install Android SDK and emulator images
3. Create an Android Virtual Device (AVD)

#### "Emulator is not responding"

**Problem**: Emulator is frozen or has insufficient resources.

**Solution**:
1. Close and restart the emulator
2. Increase RAM allocation for the emulator
3. Use hardware acceleration (HAXM for Intel, WHPX for Windows)

## Common Error Messages

### "Invariant Violation: Native module cannot be null"

**Problem**: Native module not linked properly.

**Solution**:
1. Reinstall node_modules:
   ```bash
   rm -rf node_modules
   npm install
   ```
2. Rebuild the project:
   ```bash
   expo start -c
   ```

### "TypeError: Network request failed"

**Problem**: Network connectivity issues or CORS problems.

**Solution**:
1. Check internet connectivity
2. Verify API endpoints are accessible
3. Check CORS configuration on backend
4. For localhost issues, use your machine's IP address instead

### "Error: ENOENT: no such file or directory"

**Problem**: Missing file or incorrect path.

**Solution**:
1. Verify file exists at the specified path
2. Check file permissions
3. Use relative paths correctly
4. Reinstall dependencies if missing files are from packages

## Debugging Tips

### Enable Debug Mode

1. **Backend**: Set environment variable:
   ```
   NODE_ENV=development
   DEBUG=*
   ```

2. **Frontend**: Enable React DevTools and Redux DevTools

### Logging

1. **Backend**: Use `console.log` or logging libraries like Winston
2. **Frontend**: Use `console.log` or React Developer Tools

### Error Boundaries

Implement error boundaries in React to catch and handle errors gracefully:

```typescript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## Getting Help

If you're unable to resolve an issue using this guide:

1. **Check existing issues** on GitHub
2. **Search Stack Overflow** for similar problems
3. **Join our community** on Discord or GitHub Discussions
4. **Contact support** at support@splitter.app

When seeking help, provide:
- Error messages
- Steps to reproduce
- Environment information (OS, Node version, etc.)
- Relevant code snippets
- Screenshots if applicable

## Updates

This troubleshooting guide will be updated regularly based on:
- Common issues reported by users
- New problems encountered during development
- Changes in technology stack
- Feedback from the community

For the most current version of this guide, visit: https://github.com/splitter-app/splitter/blob/main/TROUBLESHOOTING.md