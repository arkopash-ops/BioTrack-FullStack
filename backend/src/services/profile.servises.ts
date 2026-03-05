import ProfileModel, { ProfileDocument } from "../models/profile.model";

export const getMyProfile = async (userId: string): Promise<ProfileDocument | null> => {
    const profile = await ProfileModel.findOne({ userId })
        .populate({
            path: "userId",
            select: "name role -_id"
        });

    return profile;
}

export const updateMyProfile = async () => { }

export const deleteMyProfile = async () => { }