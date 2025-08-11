export type Category = {
  email?: string;
  pincode?: string;
  number?: string;
  jobTitle?: string;
  title?: string;
  desc?: any;
  timeAgo?: string;
  _id?: string;
  id?: number;
  categoryName: string;
  SubcategoryName?: string;
  categorySlug: string;
  isFeatured: boolean;
  createdAt: Date;
  date?: string;
  image: string;
  name: string;
};

export type IAdditionalService = {
  service: string;
  price: number | string;
  duration: string;
  desc: string;
};

interface ITimeSlot {
  slot: string;
}

interface IAvailability {
  allDays: boolean;
  timeSlots?: {
    from?: string;
    to?: string;
    slots: ITimeSlot[];
  };
  days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

interface ILocation {
  address: string;
  country: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsPlaceId?: string;
  locality: string;
}

interface IGalleryImage {
  img: string;
}

interface IGallery {
  images: IGalleryImage[];
  defaultImage?: string;
}

interface ISeo {
  metaTitle: string;
  metaKeywords?: string[];
  metaDescription?: string;
}
export type faq = {
  question: string;
  answer: string;
};
export interface IService {
  count?: number;
  provider?: string | any;
  providerId: string | any;
  slug?: string;
  staff?: any[];
  serviceTitle: string;
  categoryId: string | any;
  SubcategoryId: string | any;
  subCategory?: string;
  price: number;
  image?: string[];
  duration: string;
  description: string;
  additionalServices: IAdditionalService[];
  includes: string[];
  videoLink?: string;
  // availability?: IAvailability;
  location: ILocation;
  gallery: string[];
  seo: ISeo;
  createdAt?: Date;
  updatedAt?: Date;
  active?: boolean;
  faq: faq[];
  _id?: string;
  categoryName: string;
}

export type Announcement = {
  subject: string;
  message: string;
  sendTo: string;
  _id?: string;
  createdAt?: Date;
};
export type Testimonial = {
  name: string;
  jobTitle: string;
  desc: string;
  rating: number;
  image: string;
  status: boolean;
  createdAt?: Date;
  _id?: string;
};

export type FAQ = {
  question: string;
  answer: string;
  category: string | any;
  _id?: string;
  createdAt?: Date;
};

export interface Booking {
  customerId: string | any;
  acceptedBy?: string | any;
  serviceId: string | any;
  providerId: string | any;
  date: Date;
  address: string;
  notes: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'progress';
  paymentStatus: 'paid' | 'unpaid';
}
export interface BookingDetails {
  location?: {
    address: string;
    locality: string;
    pincode: string;
  };
  staff?: any;
  locality?: string;
  price: number;
  id: string | null | undefined;
  _id: string; // Booking ID
  customerId: string; // ID of the customer
  providerId: string; // ID of the provider
  acceptedById?: string | null; // ID of the person who accepted the booking
  serviceId: string; // ID of the service
  date: Date; // Booking date
  time?: string; // Optional time field
  address: string; // Booking address
  notes: string; // Notes for the booking
  status:
    | 'pending'
    | 'accepted'
    | 'completed'
    | 'cancelled'
    | 'progress'
    | 'rejected'; // Booking status
  paymentStatus: 'paid' | 'unpaid'; // Payment status
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Update timestamp
  pincode: string;
  // Customer details
  customer: {
    name: string;
    email: string;
    number: string;
    location: string;
    image: string;
    isVerified: boolean;
  } | null;

  // Provider details
  provider: {
    name: string;
    email: string;
    number: string;
    location: string;
    role: string;
    image: string;
    isAssigned: boolean;
  } | null;

  // AcceptedBy details
  acceptedBy: {
    name: string;
    number: number;
    email: string;
    image: string;
    role: string;
  } | null;

  // Service details
  service: {
    serviceTitle: string;
    categoryId: string;
    SubcategoryId: string;
    price: number;
    duration: string;
    description: string;
    image: string;
    gallery: string[];
    availability: boolean;
    location: any;
    seo: string;
  } | null;

  // Derived fields
  customerName: string; // Concatenation of customer name and email or 'N/A'
  providerName: string; // Concatenation of provider name and email or 'N/A'
  acceptedByName: string; // Concatenation of acceptedBy name and email or 'N/A'
  serviceTitle: string; // Service title or 'N/A'
}
interface Availability {
  allDays: boolean;
  timeSlots: {
    from: string;
    to: string;
    slots: { slot: string }[];
  };
  days: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

interface Location {
  address?: string;
  country?: string;
  city?: string;
  locality?: string;
  state?: string;
  pincode?: string;
  googleMapsPlaceId?: string;
  latitude?: number;
  longitude?: number;
}

export interface Gallery {
  images: {
    [x: string]: string | Blob;
    img: string;
  }[];
  defaultImage?: string;
}

interface Seo {
  metaTitle: string;
  metaKeywords?: string[];
  metaDescription?: string;
}

export interface AdditionalService {
  service?: string;
  price?: number;
  duration?: string;
}

export interface Service {
  providerId: string | any;
  staff: string | any;
  serviceTitle: string;
  categoryId: string | any;
  SubcategoryId: string | any;
  price: number;
  image?: string;
  duration: string;
  description: string;
  additionalServices?: AdditionalService[];
  videoLink?: string;
  availability: Availability;
  location: Location;
  gallery: Gallery;
  seo: Seo;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
