import { Types } from 'mongoose';

export interface HabitatArea {
    type: 'Polygon';
    coordinates: number[][][];
}

export enum PopulationStatus {
    LEAST_CONCERN = "Least Concern",
    VULNERABLE = "Vulnerable",
    ENDANGERED = "Endangered",
    CRITICALLY_ENDANGERED = "Critically Endangered",
    EXTINCT = "Extinct"
}

export interface TaxonomyI {
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
    slug: string;
    taxonomy: TaxonomyI;
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
