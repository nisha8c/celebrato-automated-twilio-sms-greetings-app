import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { prisma } from "./prisma";

const SECRET = process.env.JWT_SECRET!;

export const generateToken = (userId: number) => {
    return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
};

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return next();
    try {
        const decoded = jwt.verify(token, SECRET) as { userId: number };
        req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    } catch {
        req.user = null;
    }
    next();
};
