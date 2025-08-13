// types.ts
export interface Booking {
  serviceType: string;
  _id: string;
  status: string;
  agreedAmount: number;
  date: string;
  transactions: Transaction[];
  amount: number;
  minPrice: number;
  maxPrice: number;
  phone: string;
  address: string[];
}

export interface BookingDetails {
  _id: string;
  statusTimestamps: {
    [key: string]: string | null;
  };
  bookingDate: string;
  carBrand: string;
  carModel: string;
  serviceMode: string[];
  serviceType: string;
  serviceProviderFirstName: string;
  serviceProviderLastName: string;
  minPrice: number;
  maxPrice: number;
  // status: boolean
}

export interface BookingsResponse {
  status: boolean;
  data: Booking[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface Transaction {
  date: string;
  amount: number;
}
