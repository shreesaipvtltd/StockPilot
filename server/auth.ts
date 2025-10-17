import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    userRole?: string;
  }
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
    username: string;
    fullName: string;
    email: string;
  };
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized - Please login" });
  }

  const user = await storage.getUser(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ message: "User not found" });
  }

  (req as AuthRequest).user = {
    id: user.id,
    role: user.role,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
  };

  next();
}

export function requireRole(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(authReq.user.role)) {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }

    next();
  };
}
