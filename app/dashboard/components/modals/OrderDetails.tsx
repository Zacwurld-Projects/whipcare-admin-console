'use client';
import SidebarModalContainer from './SidebarModalContainer';
// import CheckMarkIcon from '../../assets/progressCheckmark.svg';
import dayjs from 'dayjs';
import SpinLoader from '../Loaders/SpinLoader';
// import { reflectStatusStyle } from '@/app/lib/accessoryFunctions';
import { useGlobalContext } from '@/app/context/AppContext';
import { fetchServiceProviderKpis, fetchServiceProviderOrderById } from '@/app/api/apiClient';
import { useEffect, useState } from 'react';
import { getOrdersStatusStyles } from '@/app/lib/accessoryFunctions';
import { useQuery } from '@tanstack/react-query';
import { LucideCheck } from 'lucide-react';

// Add type for order with tracking
interface OrderTracking {
  [key: string]: string | null;
}

interface OrderData {
  _id: string;
  createdAt: string;
  carBrand: string;
  carModel: string;
  serviceType: string;
  serviceTitle: string[] | string;
  status: string;
  firstName: string;
  lastName: string;
  tracking: OrderTracking;
  [key: string]: string | string[] | OrderTracking | undefined;
}

const OrderDetails = () => {
  const {
    orderDetails: { data, isLoading, heading },
    setOrderDetails,
    isDark,
  } = useGlobalContext();

  function toOrderData(obj: unknown): OrderData {
    const o = obj as Partial<OrderData> | null | undefined;
    return {
      _id: o?._id ?? '',
      createdAt: o?.createdAt ?? '',
      carBrand: o?.carBrand ?? '',
      carModel: o?.carModel ?? '',
      serviceType: o?.serviceType ?? '',
      serviceTitle: o?.serviceTitle ?? [],
      status: o?.status ?? '',
      firstName: o?.firstName ?? '',
      lastName: o?.lastName ?? '',
      tracking: o?.tracking ?? {},
    };
  }
  const [order, setOrder] = useState<OrderData>(toOrderData(data));
  const [, setLoading] = useState(isLoading);

  // Fetch order by id when modal opens
  useEffect(() => {
    if (data && data._id && data.userId) {
      setLoading(true);
      const userId = data.userId; // Use userId from modal state, not from fetched order
      fetchServiceProviderOrderById(userId, data._id)
        .then((res) => {
          setOrder(res.data);
        })
        .finally(() => setLoading(false));
    }
  }, [data]);
  const { data: kpisData } = useQuery({
    queryKey: ['serviceProviderKpis'],
    queryFn: () => fetchServiceProviderKpis(data?.userId ?? ''),
  });

  // Map _id into userContact for KYC
  const mappedKpisData = kpisData
    ? {
        ...kpisData,
        userContact: {
          _id: kpisData._id,
          firstName: kpisData.userContact?.firstName || kpisData.firstName,
          lastName: kpisData.userContact?.lastName || kpisData.lastName,
          email: kpisData.userContact?.email || kpisData.email,
          phone: kpisData.userContact?.phone || kpisData.phone,
          image: kpisData.userContact?.image || kpisData.image,
        },
      }
    : null;

  const closeModal = () =>
    setOrderDetails({ display: false, data: null, heading: '', isLoading: false });

  if (!order || !order.carBrand) {
    return (
      <SidebarModalContainer closeModal={closeModal} exitOnOutsideClick>
        <div className='center-grid h-[80vh] w-full border-green-700'>
          <SpinLoader size={64} color={`${isDark ? '#ffffff' : '#27231F'}`} thickness={2} />
        </div>
      </SidebarModalContainer>
    );
  }

  // Display user-friendly fields for the order model
  const info = [
    // { title: 'User ID', value: userDetails.id },
    // { title: 'Order ID', value: order._id },
    { title: 'Booking Date', value: dayjs(order.createdAt).format('MM/DD/YYYY / hh:mm A') },
    { title: 'Car', value: `${order.carBrand} ${order.carModel}` },
    { title: 'Service', value: order.serviceType },
    {
      title: 'Service Type',
      value: Array.isArray(order.serviceTitle) ? order.serviceTitle.join(', ') : order.serviceTitle,
    },
    {
      title: 'Service Provider',
      value: `${mappedKpisData?.userContact.firstName} ${mappedKpisData?.userContact.lastName}`,
    },
    { title: 'Status', value: order.status },
    { title: 'Customer', value: `${order.firstName} ${order.lastName}` },
  ];

  // Dynamic data for track booking from order.tracking
  const trackingSteps = [
    { key: 'Pending', title: 'Order Pending' },
    { key: 'Accepted', title: 'Order Accepted' },
    { key: 'Car washer arrived', title: 'Car Washer Arrived' },
    { key: 'In Progress', title: 'Order Service In Progress' },
    { key: 'Ready for Delivery/Pickup', title: 'Ready For Pickup/Delivery' },
    { key: 'Delivered', title: 'Delivered' },
    { key: 'Payment', title: 'Payment' },
    { key: 'Cancelled', title: 'Cancelled' },
  ];

  let bookingSteps = trackingSteps
    .filter((step) => step.key in (order.tracking || {}))
    .map((step) => ({
      title: step.title,
      key: step.key,
      date: order.tracking[step.key]
        ? dayjs(order.tracking[step.key]).format('DD-MMM-YYYY / hh:mm A')
        : null,
      completed: !!order.tracking[step.key],
    }));

  // If cancelled, show all steps except 'Delivered'
  if (order.status === 'Cancelled') {
    // bookingSteps = bookingSteps.filter((step) => step.key !== 'Delivered');
  } else if (order.status === 'Payment') {
    // If payment, show payment and remove cancelled
    bookingSteps = bookingSteps.filter((step) => step.key !== 'Cancelled');
  }

  return (
    <SidebarModalContainer closeModal={closeModal} exitOnOutsideClick>
      <>
        <div className='mb-3 flex items-center gap-[10px] text-[#27231f] *:font-medium dark:text-white'>
          <p>{heading}</p>
          <p>{'>'}</p>
          <h5 className='heading-h5'>{order._id}</h5>
          <button
            className={`${getOrdersStatusStyles(order.status)} rounded-[8px] px-3 py-1 text-[13px] font-semibold`}
          >
            {order.status}
          </button>
        </div>
        <div className='flex-column mx-3 gap-6 p-5'>
          <p className='text-[20px] font-semibold text-gray-800 dark:text-white'>Booking Info</p>
          <ul className='flex-column gap-[15.4px]'>
            {info.map((item) => (
              <li className={`flex items-center justify-between text-[13px]`} key={item.title}>
                <p className='capitalize text-gray-500 dark:text-dark-tertiary'>{item.title}</p>
                <p className='break-all font-medium text-gray-900 dark:text-white'>
                  {item.value || '-'}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className='flex w-full items-center justify-center px-10 py-4'>
          <div className='w-full'>
            <h2 className='mb-8 text-start text-xl font-bold text-gray-800 dark:text-white'>
              Track Booking
            </h2>
            <ol className='relative border-l-[10px] border-[#711E00]'>
              {bookingSteps.map((step, idx) => (
                <li key={idx} className='mb-10 flex items-start last:mb-0'>
                  <span
                    className={`absolute -left-[1.6rem] flex h-10 w-10 items-center justify-center rounded-full border-[7px] border-white ${step.completed ? 'bg-[#711E00] text-white' : 'bg-gray-300 text-gray-400'} shadow-md dark:border-dark-secondary`}
                  >
                    {step.completed ? <LucideCheck size={16} /> : null}
                  </span>
                  <div className='ml-6'>
                    <div className='text-base font-semibold text-gray-800 dark:text-white'>
                      {step.title}
                    </div>
                    <div className='mt-1 text-sm text-gray-500 dark:text-gray-300'>
                      {step.date || '-'}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className='center-grid w-full'>
          <button
            className='mx-auto mt-6 w-[64%] self-center rounded-[32px] bg-primary-900 px-10 py-[14px] font-medium text-white disabled:opacity-50 dark:bg-dark-accent'
            disabled
          >
            Track Location
          </button>
        </div>
      </>
    </SidebarModalContainer>
  );
};
export default OrderDetails;
