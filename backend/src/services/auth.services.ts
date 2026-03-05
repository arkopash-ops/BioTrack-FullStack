import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import { signToken } from "../config/jwt";
import { Roles, UserStatus } from '../types/users.types';

interface IUser {
    name: string;
    email: string;
    password: string;
}

interface UserWithoutPassword {
    _id: string;
    name: string;
    email: string;
    role: Roles;
    status: UserStatus;
}

export const register = async (
    userData: IUser
): Promise<{
    user: UserWithoutPassword;
    token: string;
}> => {
    const { name, email, password } = userData;

    if (!password) {
        throw {
            statusCode: 400,
            message: "Password is required"
        };
    }

    if (!email || !name) {
        throw {
            statusCode: 400,
            message: "Name and email are required"
        };
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        throw {
            statusCode: 400,
            message: "Email already registered"
        }
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role: Roles.VISITOR,
        status: UserStatus.NONE,
    });

    const token = signToken({ id: newUser._id, email: newUser.email, role: newUser.role });

    return {
        user: {
            _id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
        },
        token
    };
};

export const login = async (
    data: { email: string; password: string; }
): Promise<{ user: UserWithoutPassword; token: string }> => {
    const { email, password } = data;

    if (!email || !password) {
        throw {
            statusCode: 400,
            message: "Email and password are required"
        };
    }

    // Find user and include password
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
        throw {
            statusCode: 401,
            message: "Invalid email or password"
        };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw {
            statusCode: 401,
            message: "Invalid email or password"
        };
    }

    // Generate token
    const token = signToken({ id: user._id, email: user.email, role: user.role });

    return {
        user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        },
        token
    };
};