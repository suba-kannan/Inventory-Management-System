import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { AppDataSource } from '../config/data-source';

const userRepository = AppDataSource.getRepository(User);

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, phone, role } = req.body;
  
      console.log("Registering user:", { name, email, password, phone, role });
  
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        console.log("Email already exists");
        res.status(400).json({ message: "Email already exists" });
        return;
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepository.create({ name, email, password: hashedPassword, phone, role });
  
      await userRepository.save(user);
      console.log("Registered successfully!");
      res.status(201).json({ message: "Registered successfully" });
    } catch (error) {
      console.error("Error registering:", error);
      res.status(500).json({ message: "Error registering", error });
    }
  }
  

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const user = await userRepository.findOne({ where: { email } });
  
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
  
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });
  
    res.json({ token, role: user.role });
  }
  
}