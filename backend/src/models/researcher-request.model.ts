import { Document, Model, Schema, model } from "mongoose";
import { ResearcherRequest } from "../types/researcherRequest.types";
import { UserStatus } from "../types/users.types";

export interface ResearcherRequestDocument extends ResearcherRequest, Document { }

const researcherRequestSchema = new Schema<ResearcherRequestDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: Object.values(UserStatus),
            default: UserStatus.PENDING,
            required: true,
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviewedAt: { type: Date },
    },
    { timestamps: true }
);

const ResearcherRequestModel: Model<ResearcherRequestDocument> = model<ResearcherRequestDocument>(
    "ResearcherRequest",
    researcherRequestSchema
);

export default ResearcherRequestModel;
