
import { Request, Response, NextFunction } from "express";
import { getMyProfile } from "../services/profile.servises";

export const _getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id.toString(); // TS now knows user exists
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const profile = await getMyProfile(userId);

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
