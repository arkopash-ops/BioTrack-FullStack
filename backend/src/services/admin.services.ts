import mongoose from "mongoose";
import ProfileModel, { ProfileDocument } from "../models/profile.model";
import UserModel, { UserDocument } from "../models/user.model";


export const getAllUsers = async (): Promise<ProfileDocument[]> => {
    const profiles = await ProfileModel.find().populate({
        path: "userId",
        select: "name email",
    });

    if (!profiles || profiles.length === 0) {
        throw new Error("No profiles found");
    }

    return profiles;
};


export const getUserByID = async (ID: string): Promise<ProfileDocument | null> => {
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        throw new Error("Invalid User ID format");
    }

    const profile = await ProfileModel.findById(ID).populate({
        path: "userId",
        select: "name email",
    });

    if (!profile) {
        throw new Error("No profile found");
    }

    return profile;
};


export const updateUserByID = async (
    userId: string,
    data: Partial<ProfileDocument>,
    name?: string
): Promise<ProfileDocument | null> => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID format");
    }

    if (name) {
        const targetUserId = data.userId ? data.userId.toString() : userId;
        await UserModel.findByIdAndUpdate(targetUserId, { name });
    }

    const updatedProfile = await ProfileModel.findByIdAndUpdate(userId, data, { returnDocument: "after" });
    if (!updatedProfile) {
        throw new Error("Profile not found");
    }

    return updatedProfile;
};


export const deleteUserByID = async (ID: string): Promise<{ profile: ProfileDocument; user: UserDocument }> => {
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
