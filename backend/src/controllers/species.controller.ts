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
    } catch (error: any) {
        next(error);
    }
};


export const _getSpecies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;

        if (!slug || Array.isArray(slug)) {
            return res.status(400).json({ success: false, message: "Invalid or missing Species slug." });
        }

        const species = await speciesService.getSpecies(slug);

        res.status(200).json({
            success: true,
            data: species,
        });
    } catch (error: any) {
        next(error);
    }
};


export const _getAllSpecies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const speciesList = await speciesService.getAllSpecies();

        res.status(200).json({
            success: true,
            count: speciesList.length,
            data: speciesList
        });
    } catch (error: any) {
        next(error);
    }
};


export const _updateSpecies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;

        if (!slug || Array.isArray(slug)) {
            return res.status(400).json({ success: false, message: "Invalid or missing Species slug." });
        }

        const data = {
            ...req.body,
            updatedBy: req.user?._id
        };

        const updatedSpecies = await speciesService.updateSpecies(slug, data);

        res.status(200).json({
            success: true,
            message: "Species updated successfully.",
            data: updatedSpecies,
        });
    } catch (error: any) {
        next(error);
    }
};
