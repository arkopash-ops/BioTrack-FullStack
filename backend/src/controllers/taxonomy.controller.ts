import { Request, Response, NextFunction } from "express";
import * as taxonomyService from "../services/taxonomy.services"

export const _createTaxonomy = async (
    req: Request,
    res: Response,
    next: NextFunction

) => {
    try {
        const data = req.body;
        const taxonomy = await taxonomyService.createTaxonomy(data);
        res.status(201).json({ success: true, data: taxonomy });
    } catch (error: any) {
        next(error);
    }
};


export const _getAllTaxonomy = async (
    req: Request,
    res: Response,
    next: NextFunction

) => {
    try {
        const taxonomies = await taxonomyService.getAllTaxonomy();
        res.status(200).json({ success: true, data: taxonomies });
    } catch (error: any) {
        next(error);
    }
};


export const _updateTaxonomy = async (
    req: Request,
    res: Response,
    next: NextFunction

) => {
    try {
        const slug = req.params.slug;
        const data = req.body;

        if (!slug || Array.isArray(slug)) {
            throw new Error("Invalid or missing Taxonomy slug.");
        }

        const updated = await taxonomyService.updateTaxonomy(slug, data);

        if (!updated) {
            return res.status(404).json({ success: false, message: "Taxonomy not found" });
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
        next(error)
    }
};


export const _getTaxonomy = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const slug = req.params.slug;

        if (!slug || Array.isArray(slug)) {
            return res.status(400).json({ success: false, message: "Invalid or missing Taxonomy slug." });
        }

        const taxonomy = await taxonomyService.getTaxonomyBySlug(slug);

        if (!taxonomy) {
            return res.status(404).json({ success: false, message: "Taxonomy not found." });
        }

        res.status(200).json({ success: true, data: taxonomy });
    } catch (error: any) {
        next(error);
    }
};


export const _getTaxonomyTree = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { slug } = req.params;

        if (!slug || Array.isArray(slug)) {
            return res.status(400).json({ success: false, message: "Invalid or missing Taxonomy slug." });
        }

        const tree = await taxonomyService.getTaxonomyTree(slug);

        res.status(200).json({
            success: true,
            data: tree
        });

    } catch (error) {
        next(error);
    }
};
