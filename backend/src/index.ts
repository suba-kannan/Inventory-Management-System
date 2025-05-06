import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "../src/config/data-source";
import authRoutes from "../src/routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import categoryRoutes from "./routes/categoriesRoutes";
import profileRoutes from "./routes/profileRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/profile", profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/order', orderRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    
    app.listen(5000, () => {
      console.log('Server is running on http://localhost:5000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database', error);
  });