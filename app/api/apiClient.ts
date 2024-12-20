import axios from 'axios';
import ApiRoutes from './apiRoutes';

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL,
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTA1NjhlMjJlMTMxYzNhMDU3YWY4NCIsImVtYWlsIjoiZW5lcmUwMTE1QGdtYWlsLmNvbSIsIm5hbWUiOiJTbWFsbCBSZW5lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM0NDY1MjE2LCJleHAiOjE3MzUzMjkyMTZ9.XUUibyqjPFu9GqO6T6P2kPK65EjI4Hw9UF7F5lwmAQY',
  },
});

export const userService = {
  authenticate: async (email: string, password: string) => {
    const response = await API.post(ApiRoutes.Login, { email, password });

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

export const fetchServiceProvidersKpis = async () => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/kpis`);
  return reponse.data;
};

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

export const fetchServiceProviderPayemnts = async (id: string) => {
  const reponse = await API.get(`${ApiRoutes.ServiceProvider}/${id}/payments`);
  return reponse.data;
};
