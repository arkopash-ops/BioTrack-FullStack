import { Types } from 'mongoose';

export interface TaxonomyI {
    kingdom: Types.ObjectId;
    phylum?: Types.ObjectId;
    class?: Types.ObjectId;
    order?: Types.ObjectId;
    family?: Types.ObjectId;
    genus?: Types.ObjectId;
    species?: Types.ObjectId;
}

export enum LocationType {
    POLYGON = "Polygon",
    MULTIPOLYGON = "MultiPolygon"
}

export interface HabitatArea {
    type: LocationType;
    coordinates: number[][][] | number[][][][];
}

export enum PopulationStatus {
    LEAST_CONCERN = "Least Concern",
    VULNERABLE = "Vulnerable",
    ENDANGERED = "Endangered",
    CRITICALLY_ENDANGERED = "Critically Endangered",
    EXTINCT = "Extinct"
}

export interface SpeciesImage {
    url: string;
    public_id: string;
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
    images?: SpeciesImage[];
    description?: string;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
}
