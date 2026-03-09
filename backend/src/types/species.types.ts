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

export interface Species {
    commonName: string;
    scientificName: string;
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
}
