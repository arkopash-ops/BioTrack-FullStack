import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../config/jwt";
import { Roles, UserStatus } from "../types/users.types";

interface IUserInput {
    name: string;
    email: string;
    password: string;
}

export interface UserWithoutPassword {
    _id: string;
    name: string;
    email: string;
    role: Roles;
    status: UserStatus;
}

export const register = async (
    userData: IUserInput
): Promise<{ user: UserWithoutPassword; token: string }> => {
    const { name, email, password } = userData;

    if (!password) {
        const err = new Error("Password is required");
        (err as any).statusCode = 400;
        throw err;
    }

    if (!email || !name) {
        const err = new Error("Name and email are required");
        (err as any).statusCode = 400;
        throw err;
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        const err = new Error("Email already registered");
        (err as any).statusCode = 400;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role: Roles.VISITOR,
        status: UserStatus.NONE,
    });

    return {
        user: {
            _id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
        },
        token: generateToken(newUser._id.toString()),
    };
};

export const login = async (
    data: { email: string; password: string }
): Promise<{ user: UserWithoutPassword; token: string }> => {
    const { email, password } = data;

    if (!email || !password) {
        const err = new Error("Email and password are required");
        (err as any).statusCode = 400;
        throw err;
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
        const err = new Error("Invalid email or password");
        (err as any).statusCode = 401;
        throw err;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        const err = new Error("Invalid email or password");
        (err as any).statusCode = 401;
        throw err;
    }

    return {
        user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        },
        token: generateToken(user._id.toString()),
    };
};
