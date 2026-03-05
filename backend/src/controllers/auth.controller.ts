import { Request, Response } from "express";
import * as auth from "../services/auth.services";

export const _register = async (req: Request, res: Response) => {
    try {
        const { user, token } = await auth.register(req.body);

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            user,
        });

    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
};


export const _login = async (req: Request, res: Response) => {
    try {
        const { user, token } = await auth.login(req.body);

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error: any) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
};

export const _logout = async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}