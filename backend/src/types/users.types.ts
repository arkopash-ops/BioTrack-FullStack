export enum Roles {
    ADMIN = "admin",
    RESEARCHER = "researcher",
    VISITOR = "visitor"
}

export enum UserStatus {
    NONE = "none",
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
}

export interface User {
    name: string;
    email: string;
    password: string;
    role: Roles;
    status: UserStatus;
}
