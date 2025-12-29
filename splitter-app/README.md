# Splitter App - React Native Frontend

This is the React Native frontend for the Splitter expense sharing application.

## Features

- Email/password authentication with JWT
- Create and manage expense groups
- Add expenses with custom splits
- View balances and settle up with friends
- Analytics and spending insights
- Dark mode support
- Offline caching and sync

## Technology Stack

- React Native with TypeScript
- Expo for cross-platform development
- React Navigation for routing
- Zustand for state management
- Axios for API calls
- react-native-chart-kit for data visualization
- AsyncStorage for offline caching

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on iOS:
   ```bash
   npm run ios
   ```

4. Run on Android:
   ```bash
   npm run android
   ```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── screens/           # Screen components
├── navigation/        # Navigation setup
├── services/          # API service layer
├── store/             # State management (Zustand)
├── hooks/             # Custom hooks
├── utils/             # Utility functions
└── assets/            # Images, icons, etc.
```

## Components

The app includes a comprehensive set of UI components:

- Form components (TextInput, Button, etc.)
- Data display components (List, Grid, etc.)
- Navigation components (Header, TabBar, etc.)
- Overlay components (Modal, BottomSheet, etc.)
- Feedback components (Toast, Notification, etc.)
- Data visualization components (Chart, ProgressBar, etc.)
- Layout components (Card, Divider, etc.)
- Utility components (Skeleton loaders, etc.)

## State Management

The app uses Zustand for state management with persisted storage:

- Authentication state (user, token, etc.)
- Application state (dark mode, etc.)

## API Integration

The app connects to the Splitter backend API through a service layer:

- Authentication service
- User service
- Group service
- Expense service
- Balance service
- Settlement service
- Analytics service

## Offline Support

The app includes offline caching using AsyncStorage:

- Cache API responses
- Sync data when online
- Handle offline scenarios gracefully

## Styling

The app uses a consistent design system with:

- Pastel color palette
- Rounded cards with soft shadows
- Responsive layouts
- Dark mode support
- Empty state illustrations

## Animations

The app includes subtle animations using React Native Reanimated:

- Screen transitions
- Component interactions
- Loading states

## Testing

To run tests:

```bash
npm test
```

## Building for Production

To build the app for production:

```bash
expo build:android
expo build:ios
```

## EAS Build

To use EAS Build:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Configure EAS:
   ```bash
   eas build:configure
   ```

3. Build:
   ```bash
   eas build
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.