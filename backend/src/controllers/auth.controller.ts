import { Request, Response } from "express";
import { register } from "../services/auth.services";
import { hash } from "bcrypt";
import { signToken } from "../config/jwt";

export const _register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, status } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }
        const hashedPassword = await hash(password, 10);

        const newUser = await register({
            name,
            email,
            password: hashedPassword,
            role,
            status,
        });

        const token = signToken({ id: newUser._id, email: newUser.email, role: newUser.role });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "strict",
        });

        res.status(201).json({ success: true, user: newUser });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};