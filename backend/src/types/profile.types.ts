import { Types } from "mongoose";

export interface SocialLinks {
    facebook?: string;
    instagram?: string;
}

export interface Addresses {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface Profile {
    userId: Types.ObjectId;
    bio?: string;
    profileImageUrl?: string;
    phoneNo?: string;
    socialLinks: SocialLinks;
    addresses: Addresses;
}
