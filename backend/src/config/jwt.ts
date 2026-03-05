import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ThisIsMySecret";
const JWT_EXPIRES_IN = "1h";

export const signToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};