import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { adminSeeder } from "./config/adminSeeder";

const startServer = async () => {
    try {
        await connectDB();
        console.log("DB Connected from Server.");

        await adminSeeder();

        const PORT = process.env.PORT || 8081;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1);
    }
}

startServer();
