# Frequently Asked Questions (FAQ)

## Overview

This document answers common questions about the Splitter application, covering setup, usage, troubleshooting, and development topics.

## General Questions

### What is Splitter?

Splitter is a full-stack expense-sharing application that helps users track and split expenses with friends, family, or colleagues. It's similar to Splitwise but built with modern technologies including React Native, Expo, Express.js, and MongoDB.

### Is Splitter free to use?

Splitter is open-source software that you can use for free. The source code is available on GitHub under the MIT License. However, if you deploy it to production, you'll need to cover hosting and infrastructure costs.

### Which platforms does Splitter support?

Splitter supports:
- **Mobile**: iOS and Android (via React Native and Expo)
- **Web**: Progressive Web App (PWA)
- **Desktop**: Can be packaged as desktop app using Electron (planned feature)

### Do I need to be a developer to use Splitter?

While Splitter is designed to be developer-friendly, non-developers can also use it by:
1. Using a hosted version (if available)
2. Following the setup guide in the README
3. Getting help from the community

## Setup and Installation

### What are the system requirements?

**Development:**
- Node.js 16+ 
- npm 8+
- MongoDB 5+
- Git
- Code editor (VS Code recommended)

**Runtime:**
- For mobile: iOS 12+ or Android 6+
- For web: Modern browsers (Chrome, Firefox, Safari, Edge)

### How do I set up the development environment?

1. Clone the repository:
   ```bash
   git clone https://github.com/splitter-app/splitter.git
   ```

2. Set up the backend:
   ```bash
   cd splitter/splitter-backend
   npm install
   # Create .env file with your configuration
   npm run dev
   ```

3. Set up the frontend:
   ```bash
   cd splitter/splitter-app
   npm install
   expo start
   ```

For detailed instructions, see [DEVELOPMENT.md](DEVELOPMENT.md).

### How do I deploy Splitter to production?

Splitter can be deployed using several methods:

1. **Docker** (recommended):
   ```bash
   docker-compose up -d
   ```

2. **Traditional deployment**:
   - Build backend: `npm run build`
   - Start backend: `npm start`
   - Build frontend: `expo build:web`
   - Serve frontend files

3. **Cloud platforms**:
   - Heroku, AWS, Google Cloud, Azure

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Usage Questions

### How do I create a group?

1. Navigate to the Groups screen
2. Tap the "Create Group" button
3. Enter group name and description
4. Add members by selecting from your friends list
5. Tap "Save"

### How do I add an expense?

1. Navigate to a group or the main Expenses screen
2. Tap the "Add Expense" button
3. Enter expense details (description, amount, date)
4. Select who paid for the expense
5. Distribute the cost among participants
6. Tap "Save"

### How are balances calculated?

Splitter automatically calculates balances when:
- Expenses are added
- Expenses are updated
- Expenses are deleted
- Settlements are made

Balances are calculated per group and globally across all groups.

### How do I settle up with someone?

1. Navigate to the Balances screen
2. Find the person you want to settle with
3. Tap "Settle Up"
4. Enter the amount and any notes
5. Confirm the settlement

## Technical Questions

### What technologies are used in Splitter?

**Frontend:**
- React Native with Expo
- TypeScript
- Zustand for state management
- React Navigation
- Axios for HTTP requests
- react-native-chart-kit for charts

**Backend:**
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Jest for testing

### Why was React Native chosen for the frontend?

React Native was chosen because:
- Cross-platform support (iOS and Android)
- Code reusability
- Large ecosystem and community
- Good performance
- Expo for simplified development workflow

### Why was Express.js chosen for the backend?

Express.js was chosen because:
- Lightweight and flexible
- Large ecosystem of middleware
- Easy to learn and use
- Good performance
- Strong TypeScript support

### How is data stored?

Data is stored in MongoDB using Mongoose schemas:
- **Users**: User accounts and profiles
- **Groups**: Expense groups with members
- **Expenses**: Individual expenses with splits
- **Settlements**: Payments between users

### How is authentication handled?

Splitter uses JWT (JSON Web Tokens) for authentication:
1. User logs in with email/password
2. Server verifies credentials and generates JWT
3. JWT is stored on the client (AsyncStorage for mobile)
4. JWT is sent with each authenticated request
5. Server validates JWT on each request

### How does offline support work?

Splitter implements offline support through:
1. **Data caching**: Frequently accessed data stored locally
2. **Offline operations**: Users can create/update data offline
3. **Sync mechanism**: Data syncs when connectivity is restored
4. **Conflict resolution**: Handles data conflicts during sync

See [OFFLINE_SUPPORT.md](OFFLINE_SUPPORT.md) for more details.

## Development Questions

### How can I contribute to Splitter?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

### How is the code structured?

The codebase follows a modular structure:

```
splitter/
├── splitter-app/          # Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # Screen components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions
│   │   └── store/         # State management
│   └── ...
└── splitter-backend/      # Backend
    ├── src/
    │   ├── controllers/   # Request handlers
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   ├── middleware/    # Custom middleware
    │   ├── services/      # Business logic
    │   └── utils/         # Utility functions
    └── ...
```

### How are tests structured?

Splitter uses Jest for testing:

**Backend:**
- Unit tests for models, services, and utilities
- Integration tests for controllers and routes
- Test database for isolation

**Frontend:**
- Unit tests for components and hooks
- Integration tests for services
- Snapshot tests for UI components

See [TESTING.md](TESTING.md) for detailed testing guidelines.

### How is internationalization handled?

Splitter supports multiple languages through:
1. **i18next**: Internationalization framework
2. **Translation files**: JSON files for each language
3. **RTL support**: Right-to-left language support
4. **Regional formatting**: Date, time, and currency formatting

See [INTERNATIONALIZATION.md](INTERNATIONALIZATION.md) for more details.

## Troubleshooting

### I'm getting "Module not found" errors

This usually happens when:
1. Dependencies are not installed: Run `npm install`
2. Cache issues: Run `npm start -c` or `expo start -c`
3. Incorrect import paths: Check import statements

### The app won't start

Check:
1. All dependencies are installed
2. Environment variables are set
3. MongoDB is running
4. Port 3000 is not in use
5. No syntax errors in code

### Authentication isn't working

Verify:
1. JWT secret is set in environment variables
2. User credentials are correct
3. Token is being sent with requests
4. Token hasn't expired

## Security Questions

### How is user data protected?

Splitter implements several security measures:
- **Password hashing**: bcrypt for secure password storage
- **JWT authentication**: Secure token-based authentication
- **Input validation**: Zod schema validation
- **Rate limiting**: Prevent abuse
- **Security headers**: Helmet.js for HTTP headers

See [SECURITY.md](SECURITY.md) for detailed security information.

### Is data encrypted?

- **In transit**: All communication uses HTTPS
- **At rest**: MongoDB encryption can be enabled
- **Sensitive data**: Passwords are hashed, not encrypted

### How can I report a security vulnerability?

Send an email to security@splitter.app with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any possible mitigations

See [SECURITY.md](SECURITY.md) for more details.

## Performance Questions

### How can I improve app performance?

1. **Backend**:
   - Database indexing
   - Query optimization
   - Caching strategies
   - Connection pooling

2. **Frontend**:
   - Code splitting
   - Image optimization
   - Virtualized lists
   - Memoization

See [PERFORMANCE.md](PERFORMANCE.md) for detailed optimization guidelines.

### How does Splitter handle large datasets?

Splitter implements several strategies for large datasets:
- **Pagination**: API endpoints support pagination
- **Virtualization**: React Native FlatList for efficient rendering
- **Caching**: Frequently accessed data cached locally
- **Lazy loading**: Components loaded on demand

## Future Development

### What features are planned?

See [ROADMAP.md](ROADMAP.md) for the current roadmap, including:
- Advanced analytics
- Budget tracking
- Receipt processing
- Banking integrations
- AI-powered features

### How can I request a feature?

1. Check existing issues on GitHub
2. Create a new issue with the "enhancement" label
3. Describe the feature and its benefits
4. Provide use cases

### When will the next version be released?

Splitter follows a regular release cycle:
- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly for new features
- **Major releases**: Quarterly for breaking changes

Check [ROADMAP.md](ROADMAP.md) for upcoming releases.

## Community and Support

### Where can I get help?

1. **Documentation**: Check the README and other markdown files
2. **GitHub Issues**: Report bugs or request features
3. **Community Forums**: GitHub Discussions
4. **Real-time Chat**: Discord server
5. **Email Support**: support@splitter.app

### How can I join the community?

1. Star the repository on GitHub
2. Contribute code or documentation
3. Report issues or suggest features
4. Join discussions on GitHub
5. Follow on social media

### How can I stay updated?

1. **Watch** the GitHub repository
2. **Subscribe** to release notifications
3. **Follow** on Twitter (@splitterapp)
4. **Join** the Discord community
5. **Read** the blog (coming soon)

## Licensing

### Is Splitter really free?

Yes, Splitter is open-source software released under the MIT License. You can:
- Use it for personal projects
- Modify the source code
- Distribute your modifications
- Use it in commercial applications

### Can I use Splitter in my commercial application?

Yes, the MIT License allows commercial use. However:
- You must include the original copyright notice
- The software is provided "as is" without warranty
- Consider contributing improvements back to the community

### Do I need to contribute back my changes?

While not required by the MIT License, contributions are welcome and appreciated!

## Contact

### Who maintains Splitter?

Splitter is maintained by a community of developers. The core team includes:
- Lead Developer: [Lead Developer Name]
- Backend Team: [Backend Team Members]
- Frontend Team: [Frontend Team Members]

### How can I contact the team?

- **General inquiries**: team@splitter.app
- **Support**: support@splitter.app
- **Security**: security@splitter.app
- **Contributions**: contributors@splitter.app

## Updates

This FAQ will be updated regularly based on:
- Common questions from users
- New features and changes
- Community feedback
- Technology updates

For the most current version, visit: https://github.com/splitter-app/splitter/blob/main/FAQ.md