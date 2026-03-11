import { Document, model, Schema, Types } from "mongoose";
import { Rank, taxonomy } from "../types/taxonomy.types";
import slugify from "slugify";

export interface TaxonomyDocument extends taxonomy, Document { }

const taxonomySchema = new Schema<TaxonomyDocument>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
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

taxonomySchema.pre<TaxonomyDocument>("save", async function () {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
});

taxonomySchema.pre("findOneAndUpdate", function () {
    const update: any = this.getUpdate(); // get the update object
    if (update.name) {
        update.slug = slugify(update.name, { lower: true, strict: true });
    }
});

const TaxonomyModel = model<TaxonomyDocument>("Taxonomy", taxonomySchema);

export default TaxonomyModel;
