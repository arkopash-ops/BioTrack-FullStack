import { Types } from "mongoose";

export type TaxonomyTreeNode = {
    _id: Types.ObjectId;
    name: string;
    rank: string;
    children: TaxonomyTreeNode[];
};
