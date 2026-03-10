import { Types } from "mongoose"
import TaxonomyModel, { TaxonomyDocument } from "../models/taxonomy.model"
import { taxonomy } from "../types/taxonomy.types"

export const createTaxonomy = async (data: taxonomy): Promise<TaxonomyDocument> => {
    if (data.parent) {
        const parentId = typeof data.parent === "string" ? data.parent : data.parent.toString();
        if (!Types.ObjectId.isValid(parentId)) {
            throw new Error("Invalid parent ID");
        }
    }
    const taxonomy = new TaxonomyModel(data);
    return await taxonomy.save();
};


export const getAllTaxonomy = async () => {
    return await TaxonomyModel.find()
        .populate('parent', 'name description parent')
        .exec();
};


export const updateTaxonomy = async (id: string, data: Partial<taxonomy>): Promise<TaxonomyDocument | null> => {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid taxonomy ID");
    }

    if (data.parent) {
        const parentId = typeof data.parent === "string" ? data.parent : data.parent.toString();
        if (!Types.ObjectId.isValid(parentId)) {
            throw new Error("Invalid parent ID");
        }
    }

    const updatedTaxonomy = await TaxonomyModel.findByIdAndUpdate(
        id,
        { $set: data },
        { returnDocument: 'after', runValidators: true }
    ).populate('parent', 'name description');

    return updatedTaxonomy;
};
