import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user.model";

interface JwtUserPayload extends JwtPayload {
    id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        const authHeader = req.header("Authorization") || req.header("authorization");
        if (authHeader?.startsWith("Bearer ")) token = authHeader.split(" ")[1];
        if (!token && req.cookies?.token) token = req.cookies.token;

        if (!token) {
            const err = new Error("No token, authorization denied.") as any;
            err.status = 401;
            return next(err);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUserPayload;

        // Fetch user from DB
        const user = await UserModel.findById(decoded.id).select("-password");
        if (!user) {
            const err = new Error("User not found.") as any;
            err.status = 404;
            return next(err);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
