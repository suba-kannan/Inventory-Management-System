import { User } from '../entities/User';
import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import bcrypt from 'bcryptjs';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    console.log(userId)
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
       res.status(404).json({ message: "User not found" });
       return
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error });
  }
};

export const editProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const { name, email, phone, password } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
       res.status(404).json({ message: "User not found" });
       return
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await userRepo.save(user);

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};