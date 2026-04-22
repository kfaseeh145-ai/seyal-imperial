const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load env vars
// Prefer `backend/.env` when starting from repo root (npm run server).
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connect to database (Disable locally if you don't have MongoDB set up yet)
connectDB();

const app = express();

// Stripe webhook needs the raw body. It must be registered BEFORE express.json().
app.use('/api/orders/stripe/webhook', express.raw({ type: 'application/json' }));

// Body parser (for normal JSON routes)
app.use(express.json());

// Enable CORS securely for production domains
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/', (req, res) => {
  res.send('Seyal Imperial API is running...');
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
