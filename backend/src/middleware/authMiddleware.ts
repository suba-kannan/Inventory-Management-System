import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: number;
  role: string;
}

interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticateAdminToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    console.log('agsyudhabda')
    res.status(401).json({ message: 'Access denied. No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded;

    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access Denied. Admins only." });
    }
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};


export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
     res.sendStatus(401);
     return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
       res.sendStatus(403);
       return;
    }
    req.user = user as UserPayload;
    next();
  });
};
