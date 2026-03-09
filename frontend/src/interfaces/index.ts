export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
}

// For visitor/Dashboard.tsx and admin/profile/EditProfile.tsx
export interface Profile {
  _id: string;
  userId: {
    name: string;
    role: string;
  };
  bio: string;
  profileImageUrl: string;
  phoneNo: string;
  addresses: Address;
  socialLinks: SocialLinks;
  createdAt?: string;
  updatedAt?: string;
}

// For admin/profile/GetProfile.tsx
export interface GetProfileData {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  phoneNo?: string;
  bio?: string;
  addresses?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
  };
  profileImageUrl?: string;
}

// For admin/Dashboard.tsx
export interface DashboardUser {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  bio: string;
  addresses: Address;
  profileImage: string;
}

// For components/AnimatedBackground.tsx
export interface Circle {
  top: number;
  left: number;
  size: number;
}
