import UserModel, { UserDocument } from "../models/user.model";
import { User } from "../types/users.types";

export const register = async (userData: User): Promise<UserDocument> => {
    const user = new UserModel(userData);
    return await user.save();
};