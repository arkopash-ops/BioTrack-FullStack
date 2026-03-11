import { Types } from "mongoose";

export interface SpeciesTreeNode {
    _id: Types.ObjectId;
    scientificName: string;
    commonName: string;
    successor: SpeciesTreeNode[];
}
