import { Schema, Document, model, Types } from "mongoose";
import { Addresses, Profile, SocialLinks } from "../types/profile.types";

export interface ProfileDocument extends Profile, Document { }

const socialLinksSchema = new Schema<SocialLinks>({
    facebook: { type: String },
    instagram: { type: String },
}, { _id: false });

const addressSchema = new Schema<Addresses>({
    street: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    zip: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
}, { _id: false });

const profileSchema = new Schema<ProfileDocument>({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: "User"
    },
    bio: {
        type: String,
        default: "I'm new User.",
        trim: true,
        set: (s: string) => s || "I'm new User."
    },
    profileImageUrl: {
        type: String,
        default: "/public/default-profile.jpg",
        trim: true,
        set: (s: string) => s || "/public/default-profile.jpg",
    },
    phoneNo: {
        type: String,
        default: "",
        trim: true,
        match: [/^\d{10}$/, "Please use a valid phone number"],
    },
    socialLinks: {
        type: socialLinksSchema,
        default: {}
    },
    addresses: {
        type: addressSchema,
        default: {}
    },
}, { timestamps: true });

const ProfileModel = model<ProfileDocument>("Profile", profileSchema);

export default ProfileModel;
