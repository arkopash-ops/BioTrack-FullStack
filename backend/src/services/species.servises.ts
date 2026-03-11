import { Types } from "mongoose";
import SpeciesModel, { SpeciesDocument } from "../models/species.model";
import { Species } from "../types/species.types";
import { SpeciesTreeNode } from "../types/speciesTree.types";

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


export const updateSpecies = async (slug: string, data: Partial<Species>): Promise<SpeciesDocument> => {
    const species = await SpeciesModel.findOne({ slug });
    if (!species) throw new Error("Species not found");

    const oldPredecessor = species.predecessor?.toString();
    const newPredecessor = data.predecessor?.toString();

    // Update species fields
    Object.assign(species, data);
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
    if (data.successor && Array.isArray(data.successor)) {
        // Pull this species from old successors that were removed
        const oldSuccessors = (species.successor || []).map(s => new Types.ObjectId(s));
        const removedSuccessors = oldSuccessors.filter(s => !data.successor?.includes(s));

        if (removedSuccessors.length) {
            await SpeciesModel.updateMany(
                { _id: { $in: removedSuccessors } },
                { $unset: { predecessor: "" } } // remove predecessor link
            );
        }

        // Update new successors to set predecessor
        const addedSuccessors = data.successor.filter(s => !oldSuccessors.includes(s));
        if (addedSuccessors.length) {
            await SpeciesModel.updateMany(
                { _id: { $in: addedSuccessors } },
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


export const getSpeciesTree = async (slug: string) => {
    const species = await SpeciesModel.findOne({ slug });

    if (!species) {
        throw new Error("Species not found");
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

    return buildTree(species);
}
