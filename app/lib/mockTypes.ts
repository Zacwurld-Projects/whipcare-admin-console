import { StaticImageData } from 'next/image';

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
  name: string;
  email: string;
  status: string;
  phone: string;
  userInfo: {
    'Sign up date': number;
    'Last login date': number;
    Nationality: string;
    Language: string;
    NIN: string;
  };
  userAddress: {
    work: string;
  };
  servicesProvided: {
    type: string;
    brand: string;
    services: Array<{
      image: StaticImageData;
      price: string;
      type: string;
      title: string;
      distance: string;
      time: string;
    }>;
  };
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
