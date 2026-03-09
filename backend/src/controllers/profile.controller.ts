
import { Request, Response, NextFunction } from "express";
import * as profileService from "../services/profile.servises";

export const _getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id.toString();
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const profile = await profileService.getMyProfile(userId);

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found." });
        }

        res.status(200).json({
            success: true,
            message: "Successfully fetched profile.",
            profile
        });
    } catch (error: any) {
        next(error);
    }
};


export const _updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id.toString();
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const profile = await profileService.updateMyProfile(userId, req.body);

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found." });
        }

        res.status(200).json({
            success: true,
            message: "Successfully updated profile.",
            profile
        });
    } catch (error: any) {
        next(error);
    }
};


export const _deleteMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id?.toString();
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { profile, user } = await profileService.deleteMyProfile(userId);

        res.status(200).json({
            success: true,
            message: "Successfully deleted profile and user.",
            profile,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error: any) {
        next(error);
    }
};


export const _requestResearcher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id.toString();
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const profile = await profileService.requestResearcher(userId);

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found." });
        }

        res.status(200).json({
            success: true,
            message: "Successfully requested to be a researcher.",
            profile
        });
    } catch (error: any) {
        next(error);
    }
};
