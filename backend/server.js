const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

connectDB();

const app = express();

// 1. Enable CORS FIRST (Critical for handling OPTIONS/Preflight)
app.use(cors({
  origin: true,
  credentials: true,
}));

// 2. Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));
// app.use(mongoSanitize()); // Temporarily disabled to fix the IncomingMessage error

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
  message: 'Too many requests'
});
app.use('/api/', limiter);

// 4. Body parser
app.use(express.json({ limit: '10mb' }));

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
