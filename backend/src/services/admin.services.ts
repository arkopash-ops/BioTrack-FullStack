import mongoose from "mongoose";
import ProfileModel, { ProfileDocument } from "../models/profile.model";
import UserModel, { UserDocument } from "../models/user.model";

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


export const updateUserByID = async (
    userId: string,
    data: Partial<ProfileDocument>
): Promise<ProfileDocument | null> => {
    const user = await ProfileModel.findByIdAndUpdate(
        userId,
        data,
        { new: true }
    );

    if (!user) {
        throw new Error("User not found.");
    }

    return user;
};


export const deleteUserByID = async (
    ID: string
): Promise<{ profile: ProfileDocument; user: UserDocument }> => {
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        throw new Error("Invalid User ID format");
    }

    const profile = await ProfileModel.findByIdAndDelete(ID);
    if (!profile) {
        throw new Error("Profile not found");
    }

    const user = await UserModel.findByIdAndDelete(profile.userId);
    if (!user) {
        throw new Error("User not found");
    }

    return { profile, user };
};