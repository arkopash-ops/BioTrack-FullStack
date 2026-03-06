import { NextFunction, Request, Response } from "express";
import * as adminServices from "../services/admin.services";
import { ProfileDocument } from "../models/profile.model";
import { UserDocument } from "../models/user.model";

export const _getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profiles = await adminServices.getAllUsers();

        const result = profiles.map(profile => ({
            _id: profile._id,
            name: (profile.userId as any)?.name,
            email: (profile.userId as any)?.email,
            phoneNo: profile.phoneNo,
            bio: profile.bio,
            addresses: profile.addresses,
            profileImage: profile.profileImageUrl,
        }));

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}


export const _getUserByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profile = await adminServices.getUserByID(req.params.ID as string);
        return res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        next(error);
    }
}


export const _updateUserByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profile = await adminServices.updateUserByID(req.params.ID as string, req.body);
        return res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        next(error);
    }
}


export const _deleteUserByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { profile, user }: { profile: ProfileDocument; user: UserDocument } =
            await adminServices.deleteUserByID(req.params.ID as string);

        return res.status(200).json({
            success: true,
            data: {
                profile,
                user,
            },
            message: "User and profile deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
