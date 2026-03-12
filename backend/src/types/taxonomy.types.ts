import { Types } from "mongoose";

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
    slug: string;
    rank: Rank;
    parent?: Types.ObjectId | null;
    description: string;
}
