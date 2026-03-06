import mongoose from "mongoose";
import ProfileModel, { ProfileDocument } from "../models/profile.model";

export const getAllUsers = async (): Promise<ProfileDocument[]> => {
    const profiles = await ProfileModel.find()
        .populate({
            path: "userId",
            select: "name email"
        });

    if (!profiles) {
        throw new Error("No profiles found");
    }
    return profiles;
}

export const getUserByID = async (ID: string): Promise<ProfileDocument | null> => {
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        throw new Error("Invalid User ID format");
    }

    const profile = await ProfileModel.findById(ID)
        .populate({
            path: "userId",
            select: "name email"
        });

    if (!profile) {
        throw new Error("No profile found");
    }
    return profile;
}

export const updateUserByID = () => { }

export const deleteUserByID = () => { }
