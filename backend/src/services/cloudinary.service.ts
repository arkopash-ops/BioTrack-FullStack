import { cloudinary } from "../config/cloudinary";
import { SpeciesImage } from "../types/species.types";

export const uploadImageBuffer = async (
    buffer: Buffer,
    filename: string
): Promise<SpeciesImage> => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "species/images",
                public_id: filename
            },
            (error, result) => {

                if (error || !result) {
                    return reject(error);
                }

                resolve({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        );

        stream.end(buffer);
    });
};


export const deleteImageFromCloudinary = async (publicId: string) => {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
};