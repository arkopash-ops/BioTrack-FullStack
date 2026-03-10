import mongoose from "mongoose";

export enum Rank {
    KINGDOM = 'kingdom',
    PHYLUM = 'phylum',
    CLASS = 'class',
    ORDER = 'order',
    FAMILY = 'family',
    GENUS = 'genus'
}

export interface taxonomy {
    name: string;
    rank: Rank;
    parent?: mongoose.ObjectId | null;
    description: string;
}
