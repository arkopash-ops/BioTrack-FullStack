import { Types } from "mongoose";
import { UserStatus } from "./users.types";

export interface ResearcherRequest {
    userId: Types.ObjectId;
    status: UserStatus;
    reviewedBy?: Types.ObjectId;
    reviewedAt?: Date;
}
