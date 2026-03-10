import { Document, model, Schema, Types } from "mongoose";
import { Rank, taxonomy } from "../types/taxonomy.types";

export interface TaxonomyDocument extends taxonomy, Document {}

const taxonomySchema = new Schema<TaxonomyDocument>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    rank: {
        type: String,
        enum: Object.values(Rank),
        required: true
    },
    parent: {
        type: Types.ObjectId,
        ref: 'Taxonomy',
        default: null
    },
    description: { type: String },
}, { timestamps: true });

taxonomySchema.index({ name: 1, rank: 1 });
taxonomySchema.index({ parent: 1 });

const TaxonomyModel = model<TaxonomyDocument>("Taxonomy", taxonomySchema);

export default TaxonomyModel;
