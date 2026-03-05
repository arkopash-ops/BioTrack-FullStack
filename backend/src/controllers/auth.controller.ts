import { Request, Response } from "express";
import { register } from "../services/auth.services";

export const _register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, status } = req.body;

        const newUser = await register({ name, email, password, role, status });
        res.status(201).json({ success: true, user: newUser });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};