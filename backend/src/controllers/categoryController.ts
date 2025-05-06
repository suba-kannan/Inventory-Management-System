import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Categories } from "../entities/Categories";

const categoryRepo = AppDataSource.getRepository(Categories);

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepo.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const category = categoryRepo.create({ name, description });
  await categoryRepo.save(category);
  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const category = await categoryRepo.findOneBy({ id: parseInt(id) });
  if (!category) {
     res.status(404).json({ message: "Category not found" });
     return
  }

  category.name = name;
  category.description = description;

  await categoryRepo.save(category);
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await categoryRepo.findOneBy({ id: parseInt(id) });
  if (!category) {
     res.status(404).json({ message: "Category not found" });
     return
  }

  await categoryRepo.remove(category);
  res.json({ message: "Category deleted" });
};
