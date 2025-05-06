import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Supplier } from "../entities/Supplier";

const supplierRepo = AppDataSource.getRepository(Supplier);

export const getAllSuppliers = async (req: Request, res: Response) => {
  const suppliers = await supplierRepo.find();
  res.json(suppliers);
};

export const createSupplier = async (req: Request, res: Response) => {
  const { name, email, phone, address, company } = req.body;
  const supplier = supplierRepo.create({ name, email, phone, address, company });
  await supplierRepo.save(supplier);
  res.status(201).json(supplier);
};

export const updateSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, address, company } = req.body;

  const supplier = await supplierRepo.findOneBy({ id: parseInt(id) });
  if (!supplier) {
     res.status(404).json({ message: "Supplier not found" });
     return
  }

  supplier.name = name;
  supplier.email = email;
  supplier.phone = phone;
  supplier.address = address;
  supplier.company = company;

  await supplierRepo.save(supplier);
  res.json(supplier);
};

export const deleteSupplier = async (req: Request, res: Response) => {
  const { id } = req.params;

  const supplier = await supplierRepo.findOneBy({ id: parseInt(id) });
  if (!supplier) {
     res.status(404).json({ message: "Supplier not found" });
     return
  }

  await supplierRepo.remove(supplier);
  res.json({ message: "Supplier deleted" });
};
