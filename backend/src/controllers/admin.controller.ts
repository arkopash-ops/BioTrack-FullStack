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

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const _getUserByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ID = req.params.ID;

        if (!ID || Array.isArray(ID)) {
            throw new Error("Invalid or missing user ID");
        }

        const profile = await adminServices.getUserByID(ID);
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};

export const _updateUserByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ID = req.params.ID;

        if (!ID || Array.isArray(ID)) {
            throw new Error("Invalid or missing user ID");
        }

        const { name, street, city, state, zip, country, facebook, instagram, ...restData } = req.body;
        const updateData: any = { ...restData };

        if (street || city || state || zip || country) {
            updateData.addresses = {
                street: street || "",
                city: city || "",
                state: state || "",
                zip: zip || "",
                country: country || ""
            };
        }

        if (facebook || instagram) {
            updateData.socialLinks = {
                facebook: facebook || "",
                instagram: instagram || ""
            };
        }

        if (req.file) {
            updateData.profileImageUrl = `profileImage/${req.file.filename}`;
        }

        const profile = await adminServices.updateUserByID(ID, updateData, name);

        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};

export const _deleteUserByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ID = req.params.ID;

        if (!ID || Array.isArray(ID)) {
            throw new Error("Invalid or missing user ID");
        }

        const { profile, user }: { profile: ProfileDocument; user: UserDocument }
            = await adminServices.deleteUserByID(ID);

        res.status(200).json({
            success: true,
            data: { profile, user },
            message: "User and profile deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
