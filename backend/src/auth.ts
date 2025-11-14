// src/auth.ts
import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: number; // 👈 this matches what we sign in generateToken
}

/**
 * Helper to create JWTs for register/login
 */
export function generateToken(userId: number): string {
    const secret = process.env.JWT_SECRET || "supersecret";

    return jwt.sign(
        { userId },   // 👈 payload field is userId
        secret,
        { expiresIn: "7d" }
    );
}

/**
 * Auth middleware: reads Authorization header,
 * verifies JWT, attaches `user` to req.
 */
export const authMiddleware: RequestHandler = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next();
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return next();
    }

    try {
        const secret = process.env.JWT_SECRET || "supersecret";
        const decoded = jwt.verify(token, secret) as JwtPayload;

        // Attach minimal user object (id only) to the request
        (req as any).user = { id: decoded.userId };

        // For debugging:
        // console.log("Authenticated user:", (req as any).user);
    } catch (err) {
        console.error("JWT verification failed:", err);
        // Don't throw – just continue without user
    }

    next();
};
