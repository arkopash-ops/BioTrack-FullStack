import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import { Roles, UserStatus, User } from "../types/users.types";
import mongoose from "mongoose";

export const adminSeeder = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new Error("Database is not connected");
        }

        const adminEmail = "admin@mail.com";

        const existingAdmin = await UserModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin user already exists. Seeder skipped.");
            return;
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const adminUser: User = {
            name: "admin",
            email: adminEmail,
            password: hashedPassword,
            role: Roles.ADMIN,
            status: UserStatus.NONE,
        };

        const createdAdmin = await UserModel.create(adminUser);

        console.log("Admin user created successfully:", {
            _id: createdAdmin._id.toString(),
            name: createdAdmin.name,
            email: createdAdmin.email,
            role: createdAdmin.role,
            status: createdAdmin.status,
        });
    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
};
