'use client';
import SidebarModalContainer from './SidebarModalContainer';
// import CheckMarkIcon from '../../assets/progressCheckmark.svg';
import dayjs from 'dayjs';
import SpinLoader from '../Loaders/SpinLoader';
// import { reflectStatusStyle } from '@/app/lib/accessoryFunctions';
import { useGlobalContext } from '@/app/context/AppContext';
import { fetchServiceProviderOrderById } from '@/app/api/apiClient';
import { useEffect, useState } from 'react';

const OrderDetails = () => {
  const {
    orderDetails: { data, isLoading, heading },
    setOrderDetails,
    userDetails,
    isDark,
  } = useGlobalContext();

  const [order, setOrder] = useState(data);
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
  }, [data, userDetails.id]);

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
    { title: 'User ID', value: userDetails.id },
    { title: 'Order ID', value: order._id },
    { title: 'Order Date', value: dayjs(order.createdAt).format('MM/DD/YYYY / hh:mm A') },
    { title: 'Car', value: `${order.carBrand} ${order.carModel}` },
    { title: 'Service Type', value: order.serviceType },
    {
      title: 'Service Titles',
      value: Array.isArray(order.serviceTitle) ? order.serviceTitle.join(', ') : order.serviceTitle,
    },
    { title: 'Status', value: order.status },
    { title: 'Customer', value: `${order.firstName} ${order.lastName}` },
  ];

  return (
    <SidebarModalContainer closeModal={closeModal} exitOnOutsideClick>
      <>
        <div className='mb-3 flex items-center gap-[10px] text-[#27231f] *:font-medium dark:text-white'>
          <p>{heading}</p>
          <p>{'>'}</p>
          <h5 className='heading-h5 max-w-[189px] truncate'>{order._id}</h5>
        </div>
        <div className='flex-column mx-3 gap-6 p-5'>
          <p className='text-[20px] font-semibold text-gray-800 dark:text-white'>Order Info</p>
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
