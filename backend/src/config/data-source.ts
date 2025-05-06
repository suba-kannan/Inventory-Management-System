import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Supplier } from "../entities/Supplier";
import { Categories } from '../entities/Categories';
import { Order } from '../entities/Order';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  driver: require('mysql2'),
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3333'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  // dropSchema: true,
  logging: true,
  entities: [User,Product,Supplier,Categories,Order],
  migrations: ['./src/migrations/*.ts'],
  subscribers: [],
});

