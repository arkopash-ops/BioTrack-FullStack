import { Request, Response, NextFunction } from "express";
import * as taxonomyService from "../services/taxonomy.services"

export const _createTaxonomy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const taxonomy = await taxonomyService.createTaxonomy(data);
        res.status(201).json({ success: true, data: taxonomy });
    } catch (error: any) {
        next(error);
    }
};


export const _getAllTaxonomy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taxonomies = await taxonomyService.getAllTaxonomy();
        res.status(200).json({ success: true, data: taxonomies });
    } catch (error: any) {
        next(error);
    }
};


export const _updateTaxonomy = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const data = req.body;

        if (!id || Array.isArray(id)) {
            throw new Error("Invalid or missing Taxonomy ID");
        }

        const updated = await taxonomyService.updateTaxonomy(id, data);

        if (!updated) {
            return res.status(404).json({ success: false, message: "Taxonomy not found" });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
        next(error)
    }
};


