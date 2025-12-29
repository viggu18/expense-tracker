import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import groupRoutes from './routes/group.routes';
import expenseRoutes from './routes/expense.routes';
import balanceRoutes from './routes/balance.routes';
import settlementRoutes from './routes/settlement.routes';
import analyticsRoutes from './routes/analytics.routes';
import currencyRoutes from './routes/currency.routes'; // Add currency routes

// Import middleware
import { errorHandler } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { requestLogger } from './middleware/logging.middleware';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/splitter')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('MongoDB connection error:', error);
  });

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Apply request logging middleware
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/groups', authMiddleware, groupRoutes);
app.use('/api/expenses', authMiddleware, expenseRoutes);
app.use('/api/balances', authMiddleware, balanceRoutes);
app.use('/api/settlements', authMiddleware, settlementRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/currencies', currencyRoutes); // Add currency routes

// Health check endpoint
app.get('/health', (req, res) => {
  res
    .status(200)
    .json({ status: 'OK', message: 'Splitter backend is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check endpoint: http://localhost:${PORT}/health`);
});

export default app;
