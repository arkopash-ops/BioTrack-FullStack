// uploadSpeciesImages.middleware.ts
import multer from "multer";
import path from "path";
import { cloudinary } from "../config/cloudinary";
import { CloudinaryApiResponse } from "../types/cloudinaryApiResponse.types";

// Memory storage for direct upload to Cloudinary
const multerStorage = multer.memoryStorage();

export const uploadSpeciesImages = multer({
    storage: multerStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (_req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed"));
        }
    },
});

// Helper function to upload a single file to Cloudinary
export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    filename: string
) => {
    return new Promise<CloudinaryApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "species", public_id: filename },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve(result);
            }
        );

        stream.end(fileBuffer);
    });
};
