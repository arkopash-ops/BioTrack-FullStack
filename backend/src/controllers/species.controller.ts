import { Request, Response, NextFunction } from "express";
import * as speciesService from "../services/species.servises"

export const _createSpecies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;

        const speciesData = {
            ...req.body,
            createdBy: userId,
            updatedBy: userId,
        };
        const species = await speciesService.createSpecies(speciesData);

        res.status(201).json({
            success: true,
            message: "Species created successfully",
            data: species
        });
    } catch (error) {
        next(error);
    }
};


export const _getSpecies = async (req: Request, res: Response, next: NextFunction) => { };


export const _getAllSpecies = async (req: Request, res: Response, next: NextFunction) => { };


export const _updateSpecies = async (req: Request, res: Response, next: NextFunction) => { };
