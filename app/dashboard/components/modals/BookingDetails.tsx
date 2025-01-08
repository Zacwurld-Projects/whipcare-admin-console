'use client';
import { OrderDetails } from '@/app/lib/mockTypes';
import SidebarModalContainer from './SidebarModalContainer';
import CheckMarkIcon from '../../assets/progressCheckmark.svg';
import dayjs from 'dayjs';
import { Dispatch } from 'react';
import SpinLoader from '../Loaders/SpinLoader';
import { convertBookingAndOrderStatus, reflectStatusStyle } from '@/app/lib/accessoryFunctions';

const BookingDetails = ({
  type,
  booking,
  isLoading,
  setIsDisplayingBookingDetails,
}: {
  type: string;
  isLoading: boolean;
  booking: OrderDetails;
  setIsDisplayingBookingDetails: Dispatch<boolean>;
}) => {
  if (isLoading || !booking) {
    return (
      <SidebarModalContainer setIsDisplayingBookingDetails={setIsDisplayingBookingDetails}>
        <div className='center-grid h-[80vh] w-full border-green-700'>
          <SpinLoader size={64} color='#27231F' thickness={2} />
        </div>
      </SidebarModalContainer>
    );
  }

  const info = [
    { title: 'booking Date', value: dayjs(booking?.createdAt).format('MM/DD/YYYY / hh:mm A') },
    { title: 'car', value: `${booking?.carBrand} ${booking?.carModel}` },
    { title: 'service', value: booking?.serviceTitle },
    { title: 'service type', value: booking?.serviceType },
    { title: 'service provider', value: `${booking?.firstName} ${booking?.lastName}` },
  ];

  const trackBooking = (checkpoint: string) => {
    const bookingStatus = [
      'accepted',
      'received',
      'in progress',
      'ready for delivery',
      'delivered',
      'completed',
    ];
    const currentCheckpoint = bookingStatus.findIndex((item) => item === booking?.status);
    if (currentCheckpoint >= 0) {
      return bookingStatus.findIndex((item) => item === checkpoint) <= currentCheckpoint
        ? true
        : false;
    } else false;
  };

  const bookingCheckpoints = [
    {
      title: 'Order Accepted',
      date: dayjs(booking?.createdAt).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('accepted'),
    },
    {
      title: 'Car Received at Mechanic Shop',
      date: dayjs(booking?.createdAt).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('received'),
    },
    {
      title: 'Order Service In Progress',
      date: dayjs(booking?.createdAt).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('in progress'),
    },
    {
      title: 'Ready For Pickup/Delivery',
      date: dayjs(booking?.createdAt).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('ready for delivery'),
    },
    {
      title: 'Delivered',
      date: dayjs(booking?.createdAt).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('delivered'),
    },
    {
      title: 'Payment',
      date: dayjs(booking?.createdAt).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('completed'),
    },
  ];

  return (
    <SidebarModalContainer setIsDisplayingBookingDetails={setIsDisplayingBookingDetails}>
      <>
        <div className='mb-3 flex items-center gap-[10px] text-[#27231f] *:font-medium'>
          <p>{type === 'orders' ? 'Order' : 'Booking'} history list</p>
          <p>{'>'}</p>
          <h5 className='heading-h5 max-w-[189px] truncate'>#{booking._id}</h5>
          <p
            className={`text-small rounded-[6px] px-[6px] py-[2px] capitalize ${reflectStatusStyle(convertBookingAndOrderStatus(booking.status))}`}
          >
            {convertBookingAndOrderStatus(booking.status)}
          </p>
        </div>
        <div className='flex-column mx-3 gap-6 p-5'>
          <p className='text-[20px] font-semibold text-gray-800'>Booking Info</p>
          <ul className='flex-column gap-[15.4px]'>
            {info.map((item) => (
              <li className='flex items-center justify-between text-[13px]' key={item.title}>
                <p className='capitalize text-gray-500'>{item.title}</p>
                <p className='font-medium capitalize text-gray-900'>{item.value}</p>
              </li>
            ))}
            {/* {pricing.map((item) => (
                    <li className='flex items-center justify-between text-[14px]' key={item.title}>
                      <p className='capitalize text-gray-500'>{item.title}</p>
                      <p className='font-medium capitalize text-gray-900'>${item.value}</p>
                    </li>
                  ))} */}
          </ul>
          <ul>
            <p className='mb-5 text-[18px] font-medium text-gray-900'>Track Booking</p>
            {bookingCheckpoints.map((item, index) => (
              <li key={item.title} className='flex gap-[5.5px]'>
                <div className='flex-column items-center'>
                  <CheckMarkIcon
                    className={`m-[3px] ${item.checked ? '*:fill-primary-900' : ''}`}
                  />
                  {index < bookingCheckpoints.length - 1 && (
                    <span
                      className={`w-1 flex-1 ${item.checked ? 'bg-primary-900' : 'bg-gray-400'}`}
                    ></span>
                  )}
                </div>
                <div className={`${index < bookingCheckpoints.length - 1 ? 'mb-[20px]' : ''}`}>
                  <p className='text-[13px] text-gray-900'>{item.title}</p>
                  <p className='mt-[2px] text-[13px] font-medium text-gray-400'>{item.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='center-grid w-full'>
          <button
            className='mx-auto mt-6 w-[64%] self-center rounded-[32px] bg-primary-900 px-10 py-[14px] font-medium text-white disabled:opacity-50'
            disabled={booking.status === 'cancelled' || booking.status === 'completed'}
          >
            Track Location
          </button>
        </div>
      </>
    </SidebarModalContainer>
  );
};
export default BookingDetails;
