import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pool from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import expenseRoutes from './src/routes/expense.routes.js';
import categoryRoutes from './src/routes/category.routes.js';

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://expense-tracker-one-blush-80.vercel.app',
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

try {
  const connection = await pool.getConnection();
  console.log('MySQL connected successfully');
  connection.release();
} catch (err) {
  console.error('❌ MySQL connection failed');
  console.error('Code:', err.code);
  console.error('Message:', err.message);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
