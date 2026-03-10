import { Types } from 'mongoose';

export interface HabitatArea {
    type: 'Polygon';
    coordinates: number[][][];
}

export enum PopulationStatus {
    LEAST_CONCERN = "Least Concern",
    VULNERABLE = "Vulnerable",
    ENDANGERED = "Endangered",
    CRITICALLY_ENDANGERED = "Critically Endangered"
}

export interface Taxonomy {
    kingdom: Types.ObjectId;
    phylum?: Types.ObjectId;
    class?: Types.ObjectId;
    order?: Types.ObjectId;
    family?: Types.ObjectId;
    genus?: Types.ObjectId;
    species?: Types.ObjectId;
}

export interface Species {
    commonName: string;
    scientificName: string;
    aliases: string[];
    taxonomy: Taxonomy;
    predecessor?: Types.ObjectId;
    successor?: Types.ObjectId[];
    habitat?: string[];
    habitatArea?: HabitatArea
    firstDiscovery?: Date;
    lifespan?: string;
    populationStatus?: PopulationStatus;
    images?: string[];
    description?: string;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
}
