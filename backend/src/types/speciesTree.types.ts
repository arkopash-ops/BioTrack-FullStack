import { Types } from "mongoose";

export interface SpeciesTreeNode {
    _id: Types.ObjectId;
    scientificName: string;
    commonName: string;
    slug?: string;
    images?: { url: string }[];
    successor: SpeciesTreeNode[];
}
