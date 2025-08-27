import axios, { isAxiosError } from 'axios';
import ApiRoutes from './apiRoutes';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

let cachedSession: Session | null = null;
let setUnauthorizedGlobal: ((v: boolean) => void) | null = null;
export function registerUnauthorizedSetter(setter: (v: boolean) => void) {
  setUnauthorizedGlobal = setter;
}

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL,
});

API.interceptors.request.use(
  async (config) => {
    if (config.url?.startsWith(`${ApiRoutes.Auth}`)) {
      return config;
    }
    if (config.url?.startsWith(`${ApiRoutes.Settings}/members/invite/verify-otp/`)) {
      return config;
    }

    if (!cachedSession) {
      cachedSession = await getSession(); // Fetch session once and cache it
    }

    if (cachedSession?.user?.token) {
      config.headers.Authorization = `Bearer ${cachedSession.user.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      cachedSession = null;
      if (setUnauthorizedGlobal) setUnauthorizedGlobal(true);
    }
    return Promise.reject(error);
  },
);

const catchError = (error: unknown) => {
  if (isAxiosError(error)) {
    throw error.response?.data;
  } else {
    throw new Error('An unexpected error occurred');
  }
};

const fetchKpis = async (url: string, minDate: string = '', maxDate: string = '') => {
  try {
    const params = new URLSearchParams();
    if (maxDate) params.append('maxDate', maxDate);
    if (minDate) params.append('minDate', minDate);

    const response = await API.get(`${url}/kpis${params ? `?${params}` : ''}`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

const fetchTableResponse = async (
  url: string,
  pageSize: number,
  pageNumber: number,
  search?: string,
  sort?: string,
) => {
  try {
    const params = new URLSearchParams();
    if (pageSize) params.append('pageSize', pageSize.toString());
    if (pageNumber) params.append('pageNumber', pageNumber.toString());
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);

    const response = await API.get(`${url}${params ? `?${params}` : ''}`);
    return response.data;
  } catch (err) {
    catchError(err);
  }
};

//#region  AUTH
export const userService = {
  authenticate: async (email: string, password: string) => {
    const response = await API.post(`${ApiRoutes.Auth}/login`, { email, password });

    const { data, success, token } = response.data;
    if (success)
      return { ...data, token: token, privileges: data.privileges } as {
        id: string;
        email: string;
        name: string;
        role: string;
        token: string;
        privileges: string[];
      };

    return null;
  },
};

export const verifyCreateToken = async (token: string) => {
  try {
    const response = await API.post(`${ApiRoutes.Settings}/members/verify/${token}`, {
      headers: { Authorization: '' },
    });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const sendForgotPasswordOTP = async (email: string) => {
  try {
    const response = await API.post(`${ApiRoutes.Auth}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const verifyForgotPasswordOtp = async (otp: string, email: string) => {
  try {
    const response = await API.post(`${ApiRoutes.Auth}/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const resetUserPassword = async (
  token: string,
  {
    password,
    confirmPassword,
  }: {
    password: string;
    confirmPassword: string;
  },
) => {
  try {
    const response = await API.post(
      `${ApiRoutes.Auth}/reset-password`,
      {
        password,
        confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    catchError(error);
  }
};
//  #endregion

// #region OVERVIEW
export const fetchOverViewKpis = async (maxDate: string = '', minDate: string = '') =>
  fetchKpis(ApiRoutes.Overview, minDate, maxDate);

export const fetchOverviewRevenue = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Overview}/service-revenue`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const fetchOverviewServiceType = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Overview}/service-users`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};
export const fetchOverviewPaymentMethod = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Overview}/payment-method`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

// #endregion

// #region USER MANAGEMENT
export const fetchUserManagementKpis = async (maxDate: string = '', minDate: string = '') =>
  fetchKpis(ApiRoutes.Users, minDate, maxDate);

export const fetchUsers = async (
  pageSize: number = 15,
  pageNumber: number = 1,
  search: string = '',
) => {
  try {
    const response = await fetchTableResponse(`${ApiRoutes.Users}`, pageSize, pageNumber, search);
    if (!response || !response.data || response.data.length === 0) {
      console.warn('No users returned from API:', {
        response,
        url: `${ApiRoutes.Users}?pageSize=${pageSize}&pageNumber=${pageNumber}${search ? `&search=${search}` : ''}`,
      });
    }
    return response;
  } catch (error) {
    catchError(error);
  }
};
export const fetchUserKpis = async (id: string) => {
  try {
    const response = await API.get(`${ApiRoutes.Users}/${id}/kpis`);
    return response.data;
  } catch (err) {
    catchError(err);
  }
};

export const fetchUserMapping = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Users}/user-mapping`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const fetchUserYearlyCount = async (year: number) => {
  try {
    const response = await API.get(`${ApiRoutes.Users}/user-count`, {
      params: { year },
    });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const fetchUserProfile = async (id: string) => {
  try {
    const response = await API.get(`${ApiRoutes.Users}/${id}/profile`);
    return response.data;
  } catch (err) {
    catchError(err);
  }
};

export const fetchUserBookings = async (id: string) => {
  try {
    const response = await API.get(`${ApiRoutes.Users}/${id}/bookings`);
    return response.data;
  } catch (err) {
    catchError(err);
  }
};

export const fetchUserBookingsById = async (id: string, bookingId: string) => {
  try {
    const response = await API.get(`${ApiRoutes.Users}/${id}/booking/${bookingId}`);
    return response.data;
  } catch (err) {
    catchError(err);
  }
};

export const fetchUserActivity = (id: string, pageSize: number = 6, pageNumber: number = 1) =>
  fetchTableResponse(`/activity/${id}`, pageSize, pageNumber);
//  #endregion

// #region SERVICE PROVIDERS
export const fetchServiceProvidersKpis = async (maxDate: string = '', minDate: string = '') =>
  fetchKpis(ApiRoutes.ServiceProvider, minDate, maxDate);

export const fetchServiceProviderWaitList = async () => {
  const reponse = await API.get(`${ApiRoutes.Waitlist}`);
  return reponse.data;
};

// export const fetchServiceProviders = async (pageNumber = 1, pageSize = 15) => {
//   const reponse = await API.get(
//     `${ApiRoutes.ServiceProvider}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
//   );
//   return reponse.data;
// };

export const fetchServiceProviders = async (
  pageNumber = 1,
  pageSize = 15,
  search = '',
  status = 'all',
  minDate = '',
  maxDate = '',
) => {
  const params = new URLSearchParams();
  params.append('pageNumber', pageNumber.toString());
  params.append('pageSize', pageSize.toString());
  if (search) params.append('search', search);
  if (status && status !== 'all') params.append('status', status);
  if (minDate) params.append('startDate', minDate);
  if (maxDate) params.append('endDate', maxDate);

  const response = await API.get(`${ApiRoutes.ServiceProvider}?${params.toString()}`);
  return response.data;
};

export const fetchServiceProviderProfile = async (id: string) => {
  const response = await API.get(`${ApiRoutes.ServiceProvider}/${id}/profile`);
  // console.log('API Response:', response.data); // Log the response
  return response.data;
};

export const fetchServiceProviderKpis = async (id: string) => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/${id}/kpis`);
  return reponse.data;
};

// export const fetchServiceProviderProfile = async (id: string) => {
//   const reponse = await API.get(`${ApiRoutes.ServiceProvider}/${id}/profile`);
//   return reponse.data;
// };

export const fetchServiceProviderOrders = async (
  id: string,
  search: string = '',
  pageNumber: number = 1,
  pageSize: number = 10,
) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (pageNumber) params.append('pageNumber', pageNumber.toString());
  if (pageSize) params.append('pageSize', pageSize.toString());

  const response = await API.get(
    `${ApiRoutes.ServiceProvider}/${id}/orders${params.toString() ? `?${params}` : ''}`,
  );
  return response.data;
};

export const fetchServiceProviderOrderById = async (id: string, orderId: string) => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/${id}/orders/${orderId}`);
  return reponse.data;
};

export const fetchServiceProviderPayments = async (id: string) => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/${id}/payments`);
  return reponse.data;
};

export const fetchServiceProviderReviews = async (id: string) => {
  const response = await API.get(`${ApiRoutes.ServiceProvider}/${id}/reviews`);
  return response.data;
};

export const fetchServiceProviderKyc = async (_id: string) => {
  const response = await API.get(`${ApiRoutes.Kyc}/${_id}/details`);
  return response.data;
};

export const fetchServiceProvidersActivities = async (id: string) => {
  try {
    const response = await API.get(`${ApiRoutes.ServiceProvider}/${id}/activities`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};
// #region APPROVE SERVICE PROVIDER KYC
export const approveServiceProviderKyc = async (id: string) => {
  try {
    const response = await API.put(`${ApiRoutes.Kyc}/${id}/status`, { status: 'Approved' });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

//#region REJECT SERVICE PROVIDER KYC
export const rejectServiceProviderKyc = async (id: string, rejectionReason: string) => {
  try {
    const response = await API.put(`${ApiRoutes.Kyc}/${id}/status`, {
      status: 'Rejected',
      rejectionReason,
    });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

// #region SERVICE PROVIDER AVAILABILITY
export const fetchServiceProviderAvailability = async () => {
  try {
    const response = await API.get(`${ApiRoutes.ServiceProvider}/availability`);
    console.log('API Response:', response.data); // Log the response
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

// #region SERVICE PROVIDER DEACTIVATION
export const deactivateServiceProvider = async (id: string) => {
  try {
    const response = await API.patch(`${ApiRoutes.ServiceProvider}/${id}/deactivate`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

//#region SERVICE PROVIDER ACTIVATION
export const activateServiceProvider = async (id: string) => {
  try {
    const response = await API.patch(`${ApiRoutes.ServiceProvider}/${id}/activate`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};
// #endregion

// #region SERVICE BOOKINGS
export const fetchServiceBookingsKpis = (maxDate: string = '', minDate: string = '') =>
  fetchKpis(ApiRoutes.ServiceBooking, minDate, maxDate);

export const fetchServiceBookings = (pageSize = 15, pageNumber = 1) =>
  fetchTableResponse(`${ApiRoutes.ServiceBooking}`, pageSize, pageNumber);

export const fetchServiceBookingDetails = async (bookingId: string) => {
  try {
    const response = await API.get(`${ApiRoutes.ServiceBooking}/${bookingId}`);
    return response.data;
  } catch (err) {
    catchError(err);
  }
};

export const fetchServiceBookingsSummary = async () => {
  try {
    const response = await API.get(`${ApiRoutes.ServiceBooking}/booking-data`);
    return response.data;
  } catch (err) {
    catchError(err);
  }
};
export const fetchServiceBookingsRevenueSummary = async () => {
  try {
    const response = await API.get(`${ApiRoutes.ServiceBooking}/revenue-data`);
    return response.data;
  } catch (err) {
    catchError(err);
  }
};
// #endregion

// #region CAR MANGEMENT
export const fetchCarManagementKpis = (minDate = '', maxDate = '') =>
  fetchKpis(`${ApiRoutes.Car}`, minDate, maxDate);

export const fetchCars = (pageSize = 15, pageNumber = 1) =>
  fetchTableResponse(`${ApiRoutes.Car}`, pageSize, pageNumber);
// #endregion

// #region ACTIVITIES
export const fetchActivityKpis = () => fetchKpis(ApiRoutes.Activity, '', '');

export const fetchActivities = (pageSize: number = 6, pageNumber: number = 1) =>
  fetchTableResponse(`${ApiRoutes.Activity}`, pageSize, pageNumber);

// #endregion

// #region SETTINGS

export const fetchSettingsProfile = async () => {
  const response = await API.get(`${ApiRoutes.Settings}/profile`);
  return response.data;
};

export const updateUserProfile = async (formdata: FormData) => {
  try {
    const response = await API.patch(`${ApiRoutes.Settings}/profile`, formdata, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const changeUserPassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  try {
    const response = await API.post(`${ApiRoutes.Settings}/change-password`, { ...passwordData });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const inviteMember = async (memberData: { role: string; email: string; privileges: [] }) => {
  try {
    const response = await API.post(`${ApiRoutes.Settings}/members/invite`, { ...memberData });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

// export const addPrivileges = async (privileges: string[]) => {
//   try {
//     const response = await API.post(`${ApiRoutes.Settings}/addPrivileges`, { privileges });
//     return response.data;
//   } catch (error) {
//     catchError(error);
//   }
// };

export const fetchAdminMembers = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Settings}/members`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const setMemberCredentials = async (
  userCredentials: { name: string; newPassword: string; confirmNewPassword: string },
  token: string,
) => {
  try {
    const response = await API.post(
      `${ApiRoutes.Settings}/members/invite/set-credential`,
      {
        ...userCredentials,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const verifyMemberOtp = async (otp: string, token: string) => {
  try {
    const response = await API.post(
      `${ApiRoutes.Settings}/members/invite/verify-otp/${otp}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

//region delete admin member

export const deleteAdminMember = async (id: string) => {
  try {
    const response = await API.delete(`${ApiRoutes.Settings}/members/${id}`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

// #region update admin member
export const updateAdminMember = async (id: string, privileges: string[]) => {
  try {
    const response = await API.patch(`${ApiRoutes.Settings}/members/${id}/privileges`, {
      privileges,
    });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

//#endregion

//#region FEEDBACKS
export const fetchFeedbackStats = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Feedback}/stats`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const fetchFeedbackSuggestions = async (pageNumber = 1, pageSize = 15) =>
  fetchTableResponse(`${ApiRoutes.Feedback}/suggestions`, pageSize, pageNumber);

export const fetchFeedbackSuggestionsStats = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Feedback}/suggestions/kpis`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const updateFeedbackSuggestion = async (id: string, status: string) => {
  try {
    const response = await API.put(`${ApiRoutes.Feedback}/suggestions/${id}`, { status });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const fetchFeedbackRatings = async (pageNumber = 1, pageSize = 15) =>
  fetchTableResponse(`${ApiRoutes.Feedback}/ratings`, pageSize, pageNumber);

export const fetchFeedbackComplaints = async (pageNumber = 1, pageSize = 15) =>
  fetchTableResponse(`${ApiRoutes.Feedback}/complaints`, pageSize, pageNumber);

export const updateComplaints = async (id: string, status: string) => {
  try {
    const reponse = await API.put(`${ApiRoutes.Feedback}/complaints/${id}`, {
      status,
    });
    return reponse.data;
  } catch (error) {
    catchError(error);
  }
};

export const fetchFeedbackReviews = async (pageNumber = 1, pageSize = 15) =>
  fetchTableResponse(`${ApiRoutes.Feedback}/reviews`, pageSize, pageNumber);

export const publishFeedbackReviews = async (id: string, show: boolean) => {
  try {
    const response = await API.put(`${ApiRoutes.Feedback}/reviews/${id}/landing-page`, {
      show,
    });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

export const getFeedbackReviewsLandingPage = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Feedback}/reviews/landing-page`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};
// export const publishFeedbackReviews = async (id: string, show: boolean) => {
//   try {
//     const response = await API.put(`${ApiRoutes.Feedback}/reviews/${id}/landing-page`, {
//       show,
//     });
//     return response.data;
//   } catch (error) {
//     catchError(error);
//   }
// };
//#endregion

//#region MARKETING
export const fetchMarketingEmailList = (pageNumber = 15, pageSize = 1) =>
  fetchTableResponse(`${ApiRoutes.Marketing}/emails`, pageSize, pageNumber);
//#endregion

// #region CRON
export const fetchPushNotifications = async (pageNumber = 1, pageSize = 8) =>
  fetchTableResponse(`${ApiRoutes.Cron}/push-notification`, pageSize, pageNumber);

export const fetchCronRewards = async (pageNumber = 1, pageSize = 8) =>
  fetchTableResponse(`${ApiRoutes.Cron}/reward`, pageSize, pageNumber);

export const fetchCronServiceProviderActivities = async (pageNumber = 1, pageSize = 8) =>
  fetchTableResponse(`${ApiRoutes.Cron}/service-provider`, pageSize, pageNumber);

export const fetchCronMaintenance = async (pageNumber = 1, pageSize = 8) =>
  fetchTableResponse(`${ApiRoutes.Cron}/maintenance`, pageSize, pageNumber);

export const fetchCronCampaigns = async (pageNumber = 1, pageSize = 8) =>
  fetchTableResponse(`${ApiRoutes.Cron}/campaign`, pageSize, pageNumber);
// #endregion

// Fetch KYC details for a provider
export const fetchKycDetails = async (id: string) => {
  const response = await API.get(`/kyc/${id}/details`);
  return response.data;
};

// Expose a function to clear cachedSession for logout
// export function clearCachedSession() {
//   cachedSession = null;
// }

// // Optionally attach to window for global access in logout
// if (typeof window !== 'undefined') {
//   // @ts-ignore
//   window.clearApiClientSession = clearCachedSession;
// }
