import { HydratedDocument, Types } from "mongoose";
import SpeciesModel, { SpeciesDocument } from "../models/species.model";
import { PopulationStatus, Species, SpeciesImage } from "../types/species.types";
import { SpeciesTreeNode } from "../types/speciesTree.types";
import { Rank } from "../types/taxonomy.types";
import { deleteImageFromCloudinary, uploadImageBuffer } from "./cloudinary.service";

export const createSpecies = async (data: Species): Promise<SpeciesDocument> => {
    const exists = await SpeciesModel.findOne({ scientificName: data.scientificName });
    if (exists) {
        throw new Error("Species with this scientific name already exists");
    }

    const species = await SpeciesModel.create(data);

    // If a predecessor is there, update its successor array
    if (data.predecessor) {
        await SpeciesModel.findByIdAndUpdate(
            data.predecessor,
            { $addToSet: { successor: species._id } } // Adds the new species _id if not already present
        );
    }

    return species;
};


export const getSpecies = async (slug: string): Promise<SpeciesDocument> => {
    const species = await SpeciesModel.findOne({ slug })
        .populate("taxonomy.kingdom", "name")
        .populate("taxonomy.phylum", "name")
        .populate("taxonomy.class", "name")
        .populate("taxonomy.order", "name")
        .populate("taxonomy.family", "name")
        .populate("taxonomy.genus", "name")
        .populate("predecessor", "scientificName commonName")
        .populate("successor", "scientificName commonName");

    if (!species) {
        throw new Error("Species not found");
    }

    return species;
};


export const getAllSpecies = async () => {
    const speciesList = await SpeciesModel.find()
        .populate([
            { path: "taxonomy.kingdom", select: "name" },
            { path: "taxonomy.phylum", select: "name" },
            { path: "taxonomy.class", select: "name" },
            { path: "taxonomy.order", select: "name" },
            { path: "taxonomy.family", select: "name" },
            { path: "taxonomy.genus", select: "name" },
            { path: "predecessor", select: "scientificName commonName" },
            { path: "successor", select: "scientificName commonName" }
        ]);

    return speciesList;
};


export const getRelatedSpecies = async (slug: string) => {
    const species = await SpeciesModel.findOne({ slug });

    if (!species) {
        throw new Error("Species not found");
    }

    const genus = species.taxonomy?.genus;
    const family = species.taxonomy?.family;

    const query: any = {
        _id: { $ne: species._id }       // exclude the _id of searched species
    };

    if (genus) {
        query["taxonomy.genus"] = genus;
    } else if (family) {
        query["taxonomy.family"] = family;
    }

    const relatedSpecies = await SpeciesModel.find(query)
        .limit(10)
        .select("commonName scientificName slug taxonomy populationStatus images");

    return relatedSpecies;
}


export const updateSpecies = async (slug: string, data: Partial<Species>): Promise<SpeciesDocument> => {
    const species = await SpeciesModel.findOne({ slug });
    if (!species) throw new Error("Species not found");

    const oldPredecessor = species.predecessor?.toString() || null;
    const newPredecessor = data.predecessor?.toString() || null;

    const oldSuccessors = (species.successor || []).map(s => s.toString());
    const newSuccessors = data.successor?.map(s => s.toString()) || null;

    // Update species fields
    Object.keys(data).forEach((key) => {
        (species as any)[key] = (data as any)[key];
    });

    await species.save();

    // Handle predecessor change
    if (oldPredecessor && oldPredecessor !== newPredecessor) {
        // Remove this species
        await SpeciesModel.findByIdAndUpdate(oldPredecessor, {
            $pull: { successor: species._id }
        });
    }

    if (newPredecessor && oldPredecessor !== newPredecessor) {
        // Add this species
        await SpeciesModel.findByIdAndUpdate(newPredecessor, {
            $addToSet: { successor: species._id }
        });
    }

    // Handle successor cahnge
    if (newSuccessors) {
        const removedSuccessors = oldSuccessors.filter(s => !newSuccessors?.includes(s));
        const addedSuccessors = newSuccessors.filter(s => !oldSuccessors.includes(s));

        // Remove predecessor from removed successors
        if (removedSuccessors.length) {
            await SpeciesModel.updateMany(
                { _id: { $in: removedSuccessors.map(id => new Types.ObjectId(id)) } },
                { $unset: { predecessor: "" } } // remove predecessor link
            );
        }

        // Update new successors to set predecessor
        if (addedSuccessors.length) {
            await SpeciesModel.updateMany(
                { _id: { $in: addedSuccessors.map(id => new Types.ObjectId(id)) } },
                { $set: { predecessor: species._id } }
            );
        }
    }

    return species.populate([
        { path: "taxonomy.kingdom", select: "name" },
        { path: "taxonomy.phylum", select: "name" },
        { path: "taxonomy.class", select: "name" },
        { path: "taxonomy.order", select: "name" },
        { path: "taxonomy.family", select: "name" },
        { path: "taxonomy.genus", select: "name" },
        { path: "predecessor", select: "scientificName commonName" },
        { path: "successor", select: "scientificName commonName" }
    ]);
};


export const updateSpeciesHabitat = async (
    slug: string,
    type: "Polygon" | "MultiPolygon",
    coordinates: number[][][][] | number[][][][][]
) => {

    if (!["Polygon", "MultiPolygon"].includes(type)) {
        throw new Error("Invalid GeoJSON type. Use Polygon or MultiPolygon.");
    }

    const species = await SpeciesModel.findOne({ slug });

    if (!species) {
        throw new Error("Species not found");
    }

    species.habitatArea = {
        type,
        coordinates
    } as any;

    await species.save();

    return species;
};


export const deleteSpecies = async (slug: string) => {
    const species = await SpeciesModel.findOne({ slug });

    if (!species) {
        throw new Error("Species not found");
    }

    const predecessorId = species.predecessor;
    const successors = species.successor || [];

    // predecessor exists connect it with successors
    if (predecessorId && successors.length > 0) {

        // Add successors to predecessor
        await SpeciesModel.findByIdAndUpdate(
            predecessorId,
            { $addToSet: { successor: { $each: successors } } }
        );

        // Update successors predecessor
        await SpeciesModel.updateMany(
            { _id: { $in: successors } },
            { $set: { predecessor: predecessorId } }
        );
    }

    // no predecessor than become root nod
    if (!predecessorId && successors.length > 0) {

        await SpeciesModel.updateMany(
            { _id: { $in: successors } },
            { $unset: { predecessor: "" } }
        );
    }

    // remove this species from its predecessor successor list
    if (predecessorId) {
        await SpeciesModel.findByIdAndUpdate(
            predecessorId,
            { $pull: { successor: species._id } }
        );
    }

    await SpeciesModel.findByIdAndDelete(species._id);

    return species;
};


export const getSpeciesTree = async (slug: string) => {
    const species = await SpeciesModel.findOne({ slug });

    if (!species) {
        throw new Error("Species not found");
    }

    let root: SpeciesDocument = species;

    while (root.predecessor) {
        const parent = await SpeciesModel
            .findById(root.predecessor)
            .select("scientificName commonName predecessor successor");

        if (!parent) break;

        root = parent as SpeciesDocument;
    }

    const buildTree = async (species: SpeciesDocument): Promise<SpeciesTreeNode> => {
        const populatedSpecies = await species.populate({
            path: "successor",
            select: "scientificName commonName successor"
        });

        const successors = Array.isArray(populatedSpecies.successor)
            ? populatedSpecies.successor
            : [];

        const children = await Promise.all(
            successors.map((child: any) => buildTree(child))
        );

        return {
            _id: species._id,
            scientificName: species.scientificName,
            commonName: species.commonName,
            successor: children
        };
    };

    return buildTree(root);
}


export const searchSpecies = async (query: string) => {
    if (!query) {
        throw new Error("Search query is required");
    }

    const species = await SpeciesModel.find({
        $or: [
            { commonName: { $regex: query, $options: "i" } },
            { scientificName: { $regex: query, $options: "i" } },
            { aliases: { $regex: query, $options: "i" } }
        ]
    })
        .populate([
            { path: "taxonomy.kingdom", select: "name" },
            { path: "taxonomy.phylum", select: "name" },
            { path: "taxonomy.class", select: "name" },
            { path: "taxonomy.order", select: "name" },
            { path: "taxonomy.family", select: "name" },
            { path: "taxonomy.genus", select: "name" }
        ]);

    return species;
}


export const filterSpecies = async (
    rank?: Rank,
    taxonomyId?: string,
    populationStatus?: PopulationStatus
): Promise<SpeciesDocument[]> => {
    const filter: any = {};

    if (rank && taxonomyId) {
        if (!Object.values(Rank).includes(rank)) {
            throw new Error("Invalid taxonomy rank");
        }

        filter[`taxonomy.${rank}`] = taxonomyId;
    }

    if (populationStatus) {
        filter.populationStatus = populationStatus;
    }

    const species = await SpeciesModel.find(filter)
        .populate([
            { path: "taxonomy.kingdom", select: "name" },
            { path: "taxonomy.phylum", select: "name" },
            { path: "taxonomy.class", select: "name" },
            { path: "taxonomy.order", select: "name" },
            { path: "taxonomy.family", select: "name" },
            { path: "taxonomy.genus", select: "name" }
        ]);

    return species;
};


export const getSpeciesMap = async () => {
    const species = await SpeciesModel.find(
        { "habitatArea.coordinates.0": { $exists: true } },
        {
            commonName: 1,
            scientificName: 1,
            slug: 1,
            habitatArea: 1
        }
    );

    return species;
};


export const getSpeciesHabitat = async (slug: string) => {
    const species = await SpeciesModel.findOne(
        { slug },
        { commonName: 1, scientificName: 1, habitatArea: 1 }
    );

    if (!species) {
        throw new Error("Species not found");
    }

    return species;
};


export const groupSpeciesForMap = async (query: string) => {
    if (!query) {
        throw new Error("Search query is required");
    }

    const relatedSpecies = await SpeciesModel.find({
        $or: [
            { commonName: { $regex: query, $options: "i" } },
            { scientificName: { $regex: query, $options: "i" } },
            { aliases: { $regex: query, $options: "i" } }
        ]
    }).select("commonName scientificName slug habitatArea");

    return relatedSpecies;
};


export const uploadSpeciesImages = async (
    slug: string,
    files: Express.Multer.File[]
) => {

    const species = await SpeciesModel.findOne({ slug });

    if (!species) {
        throw new Error("Species not found");
    }

    const uploadedImages: SpeciesImage[] = [];

    for (const file of files) {

        const result = await uploadImageBuffer(
            file.buffer,
            `${Date.now()}-${file.originalname}`
        );

        uploadedImages.push(result);
    }

    species.images = species.images || [];
    species.images.push(...uploadedImages);

    await species.save();

    return species.images;
};


export const deleteSpeciesImage = async (
    slug: string,
    publicId: string
) => {

    const species = await SpeciesModel.findOne({ slug });

    if (!species) {
        throw new Error("Species not found");
    }

    const imageExists = species.images?.find(
        img => img.public_id === publicId
    );

    if (!imageExists) {
        throw new Error("Image not found for this species");
    }

    // delete from cloudinary
    await deleteImageFromCloudinary(publicId);

    // remove from database
    species.images = species.images?.filter(
        img => img.public_id !== publicId
    );

    await species.save();

    return species.images;
};
