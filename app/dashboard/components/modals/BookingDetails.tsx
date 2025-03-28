'use client';
import SidebarModalContainer from './SidebarModalContainer';
import CheckMarkIcon from '../../assets/progressCheckmark.svg';
import dayjs from 'dayjs';
import SpinLoader from '../Loaders/SpinLoader';
import { reflectStatusStyle } from '@/app/lib/accessoryFunctions';
import { useGlobalContext } from '@/app/context/AppContext';

const BookingDetails = () => {
  const {
    bookingDetails: { data, isLoading, heading },
    setBookingDetails,
    isDark,
  } = useGlobalContext();

  const closeModal = () =>
    setBookingDetails({ display: false, data: null, heading: '', isLoading: false });

  if (!data) {
    return (
      <SidebarModalContainer closeModal={closeModal} exitOnOutsideClick>
        <div className='center-grid h-[80vh] w-full border-green-700'>
          {isLoading ? (
            <SpinLoader size={64} color={`${isDark ? '#ffffff' : '#27231F'}`} thickness={2} />
          ) : (
            <p className='dark:text-white'>No Details for this booking.</p>
          )}
        </div>
      </SidebarModalContainer>
    );
  }

  const info = [
    { title: 'booking Date', value: dayjs(data?.bookingDate).format('MM/DD/YYYY / hh:mm A') },
    { title: 'car', value: `${data?.carBrand} ${data?.carModel}` },
    { title: 'service', value: data?.serviceType },
    { title: 'service type', value: data?.serviceMode },
    {
      title: 'service provider',
      value: `${data?.serviceProviderFirstName} ${data?.serviceProviderLastName}`,
    },
    {
      title: 'price range',
      value: `₦${data?.minPrice} - ₦${data?.maxPrice}`,
    },
  ];

  const convertToCheckpointDate = (date: string | null) =>
    date ? dayjs(date).format('DD-MMM-YYYY / hh:mm A') : '';

  const getCurrentStatus = () => {
    if (data.statusTimestamps.Cancelled !== null) return 'cancelled';
    if (data.statusTimestamps.Payment !== null) return 'completed';
    return 'pending';
  };

  const bookingCheckpoints = [
    {
      title: 'Order Accepted',
      date: convertToCheckpointDate(data.statusTimestamps.Accepted),
      checked: !!data.statusTimestamps.Accepted,
    },
    {
      title: 'Car Received at Mechanic Shop',
      date: convertToCheckpointDate(data.statusTimestamps.Accepted),
      checked: !!data.statusTimestamps.Accepted,
    },
    {
      title: 'Order Service In Progress',
      date: convertToCheckpointDate(data.statusTimestamps['In Progress']),
      checked: !!data.statusTimestamps['In Progress'],
    },
    {
      title: 'Ready For Pickup/Delivery',
      date: convertToCheckpointDate(data.statusTimestamps['Ready for Delivery/Pickup']),
      checked: !!data.statusTimestamps['Ready for Delivery/Pickup'],
    },
    {
      title: 'Delivered',
      date: convertToCheckpointDate(data.statusTimestamps.Delivered),
      checked: !!data.statusTimestamps.Delivered,
    },
    {
      title: 'Payment',
      date: convertToCheckpointDate(data.statusTimestamps.Payment),
      checked: !!data.statusTimestamps.Payment,
    },
  ];

  return (
    <SidebarModalContainer closeModal={closeModal} exitOnOutsideClick>
      <>
        <div className='mb-3 flex items-center gap-[10px] text-[#27231f] *:font-medium dark:text-white'>
          <p>{heading}</p>
          <p>{'>'}</p>
          <h5 className='heading-h5 max-w-[189px] truncate'>{data._id}</h5>
          <p
            className={`text-small rounded-[6px] px-[6px] py-[2px] capitalize ${reflectStatusStyle(getCurrentStatus())}`}
          >
            {getCurrentStatus()}
          </p>
        </div>
        <div className='flex-column mx-3 gap-6 p-5'>
          <p className='text-[20px] font-semibold text-gray-800 dark:text-white'>Booking Info</p>
          <ul className='flex-column gap-[15.4px]'>
            {info.map((item) => (
              <li
                className={`flex items-center justify-between ${item.title === 'price range' ? 'text-[14px]' : 'text-[13px]'}`}
                key={item.title}
              >
                <p className='capitalize text-gray-500 dark:text-dark-tertiary'>{item.title}</p>
                <p className='font-medium capitalize text-gray-900 dark:text-white'>{item.value}</p>
              </li>
            ))}
          </ul>
          <ul>
            <p className='mb-5 text-[18px] font-medium text-gray-900 dark:text-white'>
              Track Booking
            </p>
            {bookingCheckpoints.map((item, index) => (
              <li key={item.title} className='flex gap-[5.5px]'>
                <div className='flex-column items-center'>
                  <CheckMarkIcon
                    className={`m-[3px] ${item.checked ? '*:fill-primary-900 dark:*:fill-dark-accent' : ''}`}
                  />
                  {index < bookingCheckpoints.length - 1 && (
                    <span
                      className={`w-1 flex-1 ${item.checked ? 'bg-primary-900 dark:bg-dark-accent' : 'bg-gray-400'}`}
                    ></span>
                  )}
                </div>
                <div className={`${index < bookingCheckpoints.length - 1 ? 'mb-[20px]' : ''}`}>
                  <p className='text-[13px] text-gray-900 dark:text-white'>{item.title}</p>
                  <p className='mt-[2px] text-[13px] font-medium text-gray-400'>{item.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='center-grid w-full'>
          <button
            className='mx-auto mt-6 w-[64%] self-center rounded-[32px] bg-primary-900 px-10 py-[14px] font-medium text-white disabled:opacity-50 dark:bg-dark-accent'
            disabled={!data.statusTimestamps.Cancelled || !data.statusTimestamps.Payment}
          >
            Track Location
          </button>
        </div>
      </>
    </SidebarModalContainer>
  );
};
export default BookingDetails;
