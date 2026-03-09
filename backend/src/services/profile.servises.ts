import mongoose from "mongoose";
import ProfileModel, { ProfileDocument } from "../models/profile.model";
import UserModel, { UserDocument } from "../models/user.model";

export const getMyProfile = async (userId: string): Promise<ProfileDocument | null> => {
    const profile = await ProfileModel.findOne({ userId })
        .populate({
            path: "userId",
            select: "name role -_id"
        });

    if (!profile) {
        throw new Error("Profile not found.");
    }

    return profile;
};


export const updateMyProfile = async (userId: string, data: Partial<ProfileDocument>): Promise<ProfileDocument | null> => {
    const profile = await ProfileModel.findOneAndUpdate(
        { userId },
        data,
        { returnDocument: "after" }
    ).populate({
        path: "userId",
        select: "name -_id"
    });

    if (!profile) {
        throw new Error("Profile not found.");
    }

    return profile;
};


export const deleteMyProfile = async (userId: string): Promise<{ profile: ProfileDocument, user: UserDocument }> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const profile = await ProfileModel.findOneAndDelete({ userId });

        if (!profile) {
            throw new Error("Profile not found.");
        }

        const user = await UserModel.findByIdAndDelete(userId);

        if (!user) {
            throw new Error("User not found.");
        }
        
        await session.commitTransaction();
        return { profile, user };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};
