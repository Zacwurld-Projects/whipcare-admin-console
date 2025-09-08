export type ServiceProviderTableData = {
  _id: string;
  email: string | null;
  image: null | string;
  firstName: string | null;
  lastName: string | null;
  phone: null | string;
  lastLogin: string | null;
  createdAt: string | null;
  services: string[];
  // status?: string;
  kycStatus?: string | null;
  nationality?: string | null;
  serviceType: string[];
  address?: Address[];
  disabled?: {
    disabledUntil: string;
    reason: string;
  } | null;
};

export type Address = {
  id?: string;
  address?: string;
  type?: string;
  landmark?: string;
  longitude?: number;
  latitude?: number;
};
