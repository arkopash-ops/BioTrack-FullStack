import multer from "multer";
import path from "path";
import { Request } from "express";


export const upload = multer({
    storage: multer.diskStorage({
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb
        ) => {
            cb(null, path.join(__dirname, "../../public/profileImage"));
        },
        filename: (
            req: Request,
            file: Express.Multer.File,
            cb
        ) => {
            const uniqueName = Date.now() + path.extname(file.originalname);
            cb(null, uniqueName);
        },
    }),
});
