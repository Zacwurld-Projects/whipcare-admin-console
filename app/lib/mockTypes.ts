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

export type WaitlistData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  serviceType: string;
  phone: string;
  fullName: string;
  companyName: string;
  country: string;
  city: string;
  address: string;
  role: boolean;
};

// export interface Address {
//   id?: string;
//   address?: string;
//   type?: string;
//   landmark?: string;
//   longitude?: number;
//   latitude?: number;
// }
export interface BaseData {
  _id: string;
  createdAt?: string | undefined;
  lastLogin?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  userName?: string;
  serviceProvider?: string;
  carOwnerPhone?: string;
  orderId?: string;
  serviceProviderPhone?: string;
  serviceType?: string;
  date?: string;
  email?: string | undefined;
  status?: string;
  services?: string[];
  phone?: string | undefined;
  carModel?: string;
  carBrand?: string;
  colour?: string;
  lastService?: string | null;
  lastServiceDate?: string | null;
  address?: Address[];
}

export type BaseTable<T> = {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

export type BaseTableData = {
  _id?: string;
  createdAt?: string | undefined;
  lastLogin?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
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

// types.ts
export type Address = {
  id?: string;
  address: string;
  type?: string;
  landmark?: string;
  longitude?: number;
  latitude?: number;
};

export type User = {
  _id: string;
  email: string;
  password?: string;
  servicesProvided: string;
  image?: string | null;
  oauthType?: string;
  firebaseTopics?: string[];
  firstName: string;
  lastName: string;
  emailVerified?: boolean;
  phone?: string | null;
  carIds?: string[];
  available?: boolean;
  serviceType?: string;
  type?: string;
  nationality: string;
  firebaseClientId?: string | null;
  blockedUsers?: string[];
  blockedMe?: string[];
  language: string;
  referralCode?: string;
  kyc?: string;
  kycStatus: string;
  pin?: string | null;
  termsAndConditions?: boolean;
  biometrics?: boolean;
  businessName?: string;
  accountDetails?: Array<{
    id: string;
    accountNumber: string;
    accountName: string;
    recipientCode: string;
  }>;
  address: Address[];
  lastLogin: string;
  // availabilityHistory?: any[];
  createdAt: string;
  updatedAt: string;
  paystackCustomerId?: string;
  waitlisted?: boolean;
  disabled?: {
    disabledUntil: string | null;
    reason: string | null;
  };
  kycRejectionReason?: string | null;
};

export type ServiceProviderProfile = {
  user: User;
  signUpDate: string;
  lastLoginDate: string;
  NIN?: string;
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

export type PaymentInfo = {
  accountName: string;
  accountNo: string;
  bankName: string;
  recentTransactions: Array<{
    title: string;
    amount: number;
    type: string;
    date: number;
  }>;
};

export type ServiceProviderTableData = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  serviceType?: string | string[];
  createdAt?: string;
  lastLogin?: string;
  kycStatus?: string;
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
  createdAt: string | null;
  updatedAt: string | null;
  __v: number;
};

export type CronCampaign = {
  _id: string;
  campaignName: string;
  inactivityDuration: string;
  message: string;
  deliveryChannel: string | string[];
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  __v: number;
};

export type CronMaintenance = {
  _id: string;
  maintenanceDate: string | null;
  purpose: string;
  postUpdateMessage: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  __v: number;
};

export type Test = {
  id: string;
  test: string;
};
