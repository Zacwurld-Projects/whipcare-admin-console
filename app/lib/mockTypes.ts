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
