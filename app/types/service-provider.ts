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
};
