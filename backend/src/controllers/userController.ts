import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

const userRepo = AppDataSource.getRepository(User);

export const getAllUsers = async (_: Request, res: Response) => {
  const users = await userRepo.find();
   res.json(users);
   return
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, phone, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = userRepo.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
  });

  await userRepo.save(newUser);
   res.status(201).json(newUser);
   return
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, role } = req.body;

  const user = await userRepo.findOneBy({ id: Number(id) });
  if (!user) {
     res.status(404).json({ message: 'User not found' });
     return
  }

  user.name = name;
  user.email = email;
  user.phone = phone;
  user.role = role;

  await userRepo.save(user);
   res.json(user);
   return
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await userRepo.delete(id);
   res.json({ success: result.affected === 1 });
   return
};
