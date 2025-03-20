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

export interface BaseData {
  _id: string;
  createdAt: string;
  lastLogin: string;
  firstName: string;
  lastName: string;
  userName?: string;
  serviceProvider?: string;
  carOwnerPhone?: string;
  orderId?: string;
  serviceProviderPhone?: string;
  serviceType?: string;
  date?: string;
  email: string;
  status?: string;
  services?: string[];
  phone: string | null;
  carModel?: string;
  carBrand?: string;
  colour?: string;
  lastService?: string | null;
  lastServiceDate?: string | null;
}

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

export type BookingResponse = {
  _id: string;
  statusTimestamps: {
    Accepted: string | null;
    Pending: string | null;
    'Mechanic arrived': string | null;
    'In Progress': string | null;
    'Ready for Delivery/Pickup': string | null;
    Delivered: string | null;
    Payment: string | null;
    Cancelled: string | null;
  };
  bookingDate: string;
  carBrand: string;
  carModel: string;
  serviceMode: string;
  serviceType: string;
  serviceProviderFirstName: string;
  serviceProviderLastName: string;
  minPrice: number;
  maxPrice: number;
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

export type CronResponse<T> = {
  status: boolean;
  data: T[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
};

export type CronNotification = {
  _id: string;
  subject: string;
  message: string;
  audience: string;
  frequency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type CronReward = {
  _id: string;
  rewardName: string;
  rewardType: string;
  audience: string;
  message: string;
  frequency: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type CronServiceActivities = {
  _id: string;
  notificationType: string;
  deliveryChannel: string | string[];
  message: string;
  targetGroup: string;
  frequency: string;
  status: string;
  onNewBookingCreation: boolean;
  onBookingUnrespondedOneHour: boolean;
  onPerformanceMetricDrop: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export type CronCampaign = {
  _id: string;
  campaignName: string;
  inactivityDuration: string;
  message: string;
  deliveryChannel: string | string[];
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export type CronMaintenance = {
  _id: string;
  maintenanceDate: string; // ISO date string
  purpose: string;
  postUpdateMessage: string;
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export type Test = {
  id: string;
};
