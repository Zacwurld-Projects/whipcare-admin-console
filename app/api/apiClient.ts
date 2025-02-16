import axios, { isAxiosError } from 'axios';
import ApiRoutes from './apiRoutes';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

let cachedSession: Session | null = null;

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
    if (error.response?.status === 401) {
      cachedSession = null; // Clear the cache on unauthorized error
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

const fetchTableResponse = async (url: string, pageSize: number, pageNumber: number) => {
  try {
    const params = new URLSearchParams();
    if (pageSize) params.append('pageSize', pageSize.toString());
    if (pageNumber) params.append('pageNumber', pageNumber.toString());

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
      return { ...data, token: token } as {
        id: string;
        email: string;
        name: string;
        role: string;
        token: string;
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
// #endregion

// #region USER MANAGEMENT
export const fetchUserManagementKpis = async (maxDate: string = '', minDate: string = '') =>
  fetchKpis(ApiRoutes.Users, minDate, maxDate);

export const fetchUsers = async (pageSize: number = 15, pageNumber: number = 1) =>
  fetchTableResponse(`${ApiRoutes.Users}`, pageSize, pageNumber);

export const fetchUserKpis = async (id: string) => {
  try {
    const response = await API.get(`${ApiRoutes.Users}/${id}/kpis`);
    return response.data;
  } catch (err) {
    catchError(err);
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

export const fetchUserActivity = (id: string, pageSize: number = 6, pageNumber: number = 1) =>
  fetchTableResponse(`/activity/${id}`, pageSize, pageNumber);
//  #endregion

// #region SERVICE PROVIDERS
export const fetchServiceProvidersKpis = async (maxDate: string = '', minDate: string = '') =>
  fetchKpis(ApiRoutes.ServiceProvider, minDate, maxDate);

export const fetchServiceProviderWaitList = async () => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/waitlist`);
  return reponse.data;
};

export const fetchServiceProviders = async (pageNumber = 1, pageSize = 15) => {
  const reponse = await API.get(
    `${ApiRoutes.ServiceProvider}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
  return reponse.data;
};

export const fetchServiceProviderKpis = async (id: string) => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/${id}/kpis`);
  return reponse.data;
};

export const fetchServiceProviderProfile = async (id: string) => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/${id}/profile`);
  return reponse.data;
};

export const fetchServiceProviderOrders = async (id: string) => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/${id}/orders`);
  return reponse.data;
};

export const fetchServiceProviderOrderById = async (userId: string, orderId: string) => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/${userId}/orders/${orderId}`);
  return reponse.data;
};

export const fetchServiceProviderPayments = async (id: string) => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/${id}/payments`);
  return reponse.data;
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
// #endregion

// #region CAR MANGEMENT
export const fetchCarMangemntKpis = (minDate = '', maxDate = '') =>
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

export const inviteMember = async (memberData: { role: string; email: string }) => {
  try {
    const response = await API.post(`${ApiRoutes.Settings}/members/invite`, { ...memberData });
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

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

export const fetchFeedbackSuggestions = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Feedback}/suggestions`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};
export const fetchFeedbackRatings = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Feedback}/ratings`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};
export const fetchFeedbackComplaints = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Feedback}/complaints`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};
export const fetchFeedbackReviews = async () => {
  try {
    const response = await API.get(`${ApiRoutes.Feedback}/reviews`);
    return response.data;
  } catch (error) {
    catchError(error);
  }
};

//#endregion

// #region CRON
export const fetchPushNotifications = async (pageNumber = 1, pageSize = 8) =>
  fetchTableResponse(`${ApiRoutes.Cron}/push-notification`, pageSize, pageNumber);

export const fetchCronRewards = async (pageNumber = 1, pageSize = 8) =>
  fetchTableResponse(`${ApiRoutes.Cron}/reward`, pageSize, pageNumber);

export const fetchServiceProviderActivities = async (pageNumber = 1, pageSize = 8) =>
  fetchTableResponse(`${ApiRoutes.Cron}/service-provider`, pageSize, pageNumber);

export const fetchMaintenace = async (pageNumber = 1, pageSize = 8) =>
  fetchTableResponse(`${ApiRoutes.Cron}/maintenance`, pageSize, pageNumber);

export const fetchCampaigns = async (pageNumber = 1, pageSize = 8) =>
  fetchTableResponse(`${ApiRoutes.Cron}/campaign`, pageSize, pageNumber);
// #endregion
