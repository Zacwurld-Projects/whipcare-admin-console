export type UserProfileData = {
  signUpDate: string;
  lastLoginDate: string;
  kycDocument: string;
  nationality: string;
  language: string;
  address: {
    id: string;
    address: string;
    type: string;
    landmark: string;
    longitude: number;
    latitude: number;
  }[];
  cars: {
    _id: string;
    ownerId: string;
    brand: string;
    carModel: string;
    colour: string;
    createdAt: string;
    updatedAt: string;
  }[];
  reviews: Array<{
    rating: number;
    content: string;
    timestamp: number;
  }>;
};

export type UserActivity = {
  status: boolean;
  data: Activity[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
};

export type Activity = {
  _id: string;
  activityType: string;
  description: string;
  email: string;
  data: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      image: string | null;
      type: string;
    };
  };
  createdAt: string;
  updatedAt: string;
};

export type ServiceProviderProfile = {
  signUpDate: number;
  status?: string;
  lastLoginDate: number;
  nationality: string;
  language: string;
  NIN?: string;
  address: [];
  servicesProvided: Array<{
    _id: string;
    serviceType: string;
    serviceTitle: string;
    images: Array<string>;
    preferredCarBrand: string;
    minPrice: number;
    maxPrice: number;
    distance?: string;
    time?: string;
  }>;
};

export type Booking = {
  id: string;
  bookingDate: number;

  phoneNo: string;
  location: string;
  status: 'pending' | 'on going' | 'completed' | 'cancelled';
  bookingStatus:
    | 'accepted'
    | 'received'
    | 'in progress'
    | 'ready for delivery'
    | 'delivered'
    | 'completed'
    | '';
  car: string;
  service: string;
  serviceType: string;
  serviceProvider: string;
  brakeServices: string;
  total: string;
};

export type Orders = {
  _id: string;
  createdAt: string;
  carBrand: string;
  carModel: string;
  serviceType: string;
  status: string;
  location?: string;
};

export type OrderDetails = {
  _id: string;
  createdAt: string;
  carBrand: string;
  carModel: string;
  serviceType: string;
  serviceTitle: string;
  status: string;
  firstName: string[];
  lastName: string[];
};
