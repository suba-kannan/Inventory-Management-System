import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import * as XLSX from "xlsx";
import multer from "multer";
import path from "path";
import { Repository } from "typeorm";

const productRepo: Repository<Product> = AppDataSource.getRepository(Product);
const orderRepo: Repository<Order> = AppDataSource.getRepository(Order);

export const getProducts = async (_: Request, res: Response): Promise<void> => {
  const products = await productRepo.find();
  res.json(products);
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, supplier, price, stock } = req.body;

    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock);

    if (!name || !category || !supplier || isNaN(numericPrice) || isNaN(numericStock)) {
      res.status(400).json({ message: "Invalid product data" });
      return;
    }

    const product = productRepo.create({
      name,
      category,
      supplier,
      price: numericPrice,
      stock: numericStock,
    });

    await productRepo.save(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const product = await productRepo.findOneBy({ id });

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  productRepo.merge(product, req.body);
  const result = await productRepo.save(product);
  res.json(result);
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "uploads/");
    },
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname !== ".xlsx" && extname !== ".xls") {
      return cb(new Error("Only Excel files are allowed!"));
    }
    cb(null, true);
  },
}).single("file");

export const uploadMiddleware = upload;

export const uploadExcelFile = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet);

    const cleanedData: Partial<Product>[] = rawData.map((item) => ({
      name: String(item.name),
      category: String(item.category),
      supplier: String(item.supplier),
      price: parseFloat(String(item.price)),
      stock: parseInt(String(item.stock), 10),
    }));

    const savedProducts = await productRepo.save(cleanedData);
    res.status(201).json({ message: "Products added successfully", data: savedProducts });
  } catch (error) {
    res.status(500).json({ message: "Error processing Excel file", error: (error as Error).message });
  }
};

