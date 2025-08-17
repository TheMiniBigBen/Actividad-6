import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { setInventoryRoutes } from './routes/inventoryRoutes';
import authRoutes from './routes/authRoutes';
import movementRoutes from './routes/movementRoutes';
import productLogRoutes from './routes/productLogRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(json());

connectDB();

app.get('/', (_req, res) => res.send('Inventory API running'));

app.use('/api/auth', authRoutes);
setInventoryRoutes(app);

// Error handler (simple)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err?.status || 500).json({ message: err?.message || 'Server error' });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.use('/api/movements', movementRoutes);

app.use('/api/products/logs', productLogRoutes);
