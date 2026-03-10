import { Document, model, Schema, Types } from "mongoose";
import { HabitatArea, PopulationStatus, Species, TaxonomyI } from "../types/species.types";

export interface SpeciesDocument extends Species, Document { }

const habitatAreaSchema = new Schema<HabitatArea>({
    type: {
        type: String,
        enum: ['Polygon'],
        default: 'Polygon'
    },
    coordinates: {
        type: [[[Number]]],
        required: false,
    }
}, { _id: false });

const taxonomySchema = new Schema<TaxonomyI>({
    kingdom: {
        type: Types.ObjectId,
        ref: "Taxonomy",
        required: true
    },
    phylum: {
        type: Types.ObjectId,
        ref: "Taxonomy",
        default: null
    },
    class: {
        type: Types.ObjectId,
        ref: "Taxonomy",
        default: null
    },
    order: {
        type: Types.ObjectId,
        ref: "Taxonomy",
        default: null
    },
    family: {
        type: Types.ObjectId,
        ref: "Taxonomy",
        default: null
    },
    genus: {
        type: Types.ObjectId,
        ref: "Taxonomy",
        default: null
    },
    species: {
        type: Types.ObjectId,
        ref: "Species",
        default: null
    },
}, { _id: false });

const speciesSchema = new Schema<SpeciesDocument>({
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
    aliases: {
        type: [String],
        default: [],
        index: true,
    },
    taxonomy: taxonomySchema,
    predecessor: {
        type: Types.ObjectId,
        ref: "Species",
    },
    successor: {
        type: [{
            type: Types.ObjectId,
            ref: "Species"
        }],
        default: [],
    },
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
    updatedBy: {
        type: Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true });

speciesSchema.index({ aliases: 1 });        
speciesSchema.index({ habitatArea: "2dsphere" });       // for geo queries

const SpeciesModel = model<SpeciesDocument>("Species", speciesSchema);

export default SpeciesModel;
