import { Request, Response, NextFunction } from "express";
import { Roles } from "../types/users.types";
import { UserDocument } from "../models/user.model";

const authorizedRole = (...allowedRoles: Roles[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user as UserDocument | undefined;
        if (!user || !allowedRoles.includes(user.role)) {
            const err = new Error("Access Denied.");
            (err as any).status = 403;
            return next(err);
        }
        next();
    };
};

export default authorizedRole;
