import { Types } from "mongoose";
import TaxonomyModel, { TaxonomyDocument } from "../models/taxonomy.model";
import { taxonomy } from "../types/taxonomy.types";
import { TaxonomyTreeNode } from "../types/taxonomyTree.types";

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


export const updateTaxonomy = async (slug: string, data: Partial<taxonomy>): Promise<TaxonomyDocument | null> => {
    if (data.parent) {
        const parentId = typeof data.parent === "string" ? data.parent : data.parent.toString();
        if (!Types.ObjectId.isValid(parentId)) {
            throw new Error("Invalid parent ID");
        }
    }

    const updated = await TaxonomyModel.findOneAndUpdate(
        { slug },
        { $set: data },
        { returnDocument: 'after', runValidators: true }
    ).populate('parent', 'name description');
    return updated;
};


export const getTaxonomyBySlug = async (slug: string): Promise<TaxonomyDocument | null> => {
    if (!slug || typeof slug !== "string") {
        throw new Error("Invalid or missing Taxonomy slug.");
    }

    const taxonomy = await TaxonomyModel.findOne({ slug })
        .populate("parent", "name description")
        .exec();

    return taxonomy;
};


export const getTaxonomyTree = async (slug: string): Promise<TaxonomyTreeNode> => {
    const taxonomy = await TaxonomyModel
        .findOne({ slug })
        .select("name rank parent");

    if (!taxonomy) {
        throw new Error("Taxonomy not found");
    }

    const buildSubTree = async (node: any): Promise<any> => {
        const children = await TaxonomyModel
            .find({ parent: node._id })
            .select("name rank parent");

        const childNodes = await Promise.all(
            children.map(child => buildSubTree(child))
        );

        return {
            _id: node._id,
            name: node.name,
            rank: node.rank,
            children: childNodes
        };
    };
    const subtree = await buildSubTree(taxonomy);

    let current = taxonomy;
    let tree = subtree;

    while (current.parent) {
        const parent = await TaxonomyModel
            .findById(current.parent)
            .select("name rank parent");

        if (!parent) break;

        tree = {
            _id: parent._id,
            name: parent.name,
            rank: parent.rank,
            children: [tree]
        };
        current = parent;
    }

    return tree;
};
