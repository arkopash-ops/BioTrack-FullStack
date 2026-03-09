import { Document, model, Schema, Types } from "mongoose";
import { PopulationStatus, Species } from "../types/species.types";

export interface SpeciesDocument extends Species, Document { }

const habitatAreaSchema = new Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        default: 'Polygon'
    },
    coordinates: {
        type: [[[Number]]],
        required: false,
    }
});

const speciesSchema = new Schema({
    commonName: {
        type: String,
        required: true,
        trim: true,
    },
    scientificName: {
        type: String,
        required: true,
        trim: true,
    },
    predecessor: {
        type: Types.ObjectId,
        ref: "Species",
    },
    successor: [{
        type: Types.ObjectId,
        ref: "Species",
        default: [],
    }],
    habitat: {
        type: [String],
        default: []
    },
    habitatArea: {
        type: habitatAreaSchema,
        default: () => ({
            type: 'Polygon',
            coordinates: [],
        })
    },
    firstDiscovery: {
        type: Date,
        default: null,
    },
    lifespan: { type: String },
    populationStatus: {
        type: String,
        enum: Object.values(PopulationStatus),
        default: PopulationStatus.LEAST_CONCERN,
    },
    images: {
        type: [String],
        default: [],
    },
    description: { type: String },
    createdBy: {
        type: Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });

speciesSchema.index({ habitatArea: "2dsphere" });       // for geo queries

const SpeciesModel = model<SpeciesDocument>("Species", speciesSchema);

export default SpeciesModel;