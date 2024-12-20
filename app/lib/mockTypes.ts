export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  userInfo: {
    'Sign up date': number;
    'Last login date': number;
    Nationality: string;
    Language: string;
  };
  userAddress: {
    home: string;
    work: string;
    other: string;
  };
  cars: string[];
  reviews: Array<{
    rating: number;
    content: string;
    timestamp: number;
  }>;
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
