import SpeciesModel, { SpeciesDocument } from "../models/species.model";
import { Species } from "../types/species.types";

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


export const getSpecies = async () => { };


export const getAllSpecies = async () => { };


export const updateSpecies = async () => { };
