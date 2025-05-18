export type ServiceProviderTableData = {
  _id: string;
  email: string;
  image: null | string;
  firstName: string;
  lastName: string;
  phone: null | string;
  lastLogin: string;
  createdAt: string;
  services: string[];
  status?: string;
};
