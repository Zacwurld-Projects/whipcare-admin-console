'use client';
import { Booking } from '@/app/lib/mockTypes';
import DarkOverlay from '../DarkOverlay';
import CheckMarkIcon from '../../assets/progressCheckmark.svg';
import LeftArrowIcon from '../../assets/leftArrow.svg';
import dayjs from 'dayjs';
import { Dispatch, useRef } from 'react';

const BookingDetails = ({
  type,
  booking,
  setIsDisplayingBookingDetails,
}: {
  type: string;
  booking: Booking;
  setIsDisplayingBookingDetails: Dispatch<{
    display: boolean;
    booking: Booking | null;
  }>;
}) => {
  const info = [
    { title: 'booking Date', value: dayjs(booking.bookingDate).format('MM/DD/YYYY / hh:mm A') },
    { title: 'car', value: booking.car },
    { title: 'service', value: booking.service },
    { title: 'service type', value: booking.serviceType },
    { title: 'service provider', value: booking.serviceProvider },
  ];

  const pricing = [
    { title: 'brake services', value: booking.brakeServices },
    { title: 'total', value: booking.total },
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
    const currentCheckpoint = bookingStatus.findIndex((item) => item === booking.bookingStatus);
    if (currentCheckpoint >= 0) {
      return bookingStatus.findIndex((item) => item === checkpoint) <= currentCheckpoint
        ? true
        : false;
    } else false;
  };

  const bookingCheckpoints = [
    {
      title: 'Order Accepted',
      date: dayjs(booking.bookingDate).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('accepted'),
    },
    {
      title: 'Car Received at Mechanic Shop',
      date: dayjs(booking.bookingDate).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('received'),
    },
    {
      title: 'Order Service In Progress',
      date: dayjs(booking.bookingDate).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('in progress'),
    },
    {
      title: 'Ready For Pickup/Delivery',
      date: dayjs(booking.bookingDate).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('ready for delivery'),
    },
    {
      title: 'Delivered',
      date: dayjs(booking.bookingDate).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('delivered'),
    },
    {
      title: 'Payment',
      date: dayjs(booking.bookingDate).format('DD-MMM-YYYY / hh:mm A'),
      checked: trackBooking('completed'),
    },
  ];

  const reflectStatusStyle = () => {
    switch (true) {
      case booking.status === 'cancelled':
        return `bg-[#fbeae9] text-[#dd524d]`;
      case booking.status === 'pending':
        return `bg-primary-50 text-[#ff915b]`;
      case booking.status === 'completed' || booking.status === 'on going':
        return `bg-[#e7f6ec] text-[#40b869]`;
      default:
        return '';
    }
  };

  const DetailsAsideRef = useRef<HTMLDivElement>(null);

  return (
    <DarkOverlay
      exitFunction={(e) => {
        if (!DetailsAsideRef.current?.contains(e.target as Node)) {
          setIsDisplayingBookingDetails({
            display: false,
            booking: null,
          });
        }
      }}
    >
      <aside
        ref={DetailsAsideRef}
        className='ml-auto min-h-full w-[calc(50%-132px)] bg-white p-6 opacity-100'
      >
        <button
          className='center-grid sticky top-6 mb-4 size-[36px] rounded-full border border-[#d1d5db]'
          onClick={() =>
            setIsDisplayingBookingDetails({
              display: false,
              booking: null,
            })
          }
        >
          <LeftArrowIcon />
        </button>
        <div className='mb-3 flex items-center gap-[10px] text-[#27231f] *:font-medium'>
          <p>{type === 'orders' ? 'Order' : 'Booking'} history list</p>
          <p>{'>'}</p>
          <h5 className='heading-h5'>#{booking.id}</h5>
          <p
            className={`text-small rounded-[6px] px-[6px] py-[2px] capitalize ${reflectStatusStyle()}`}
          >
            {booking.status}
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
            {pricing.map((item) => (
              <li className='flex items-center justify-between text-[14px]' key={item.title}>
                <p className='capitalize text-gray-500'>{item.title}</p>
                <p className='font-medium capitalize text-gray-900'>${item.value}</p>
              </li>
            ))}
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
      </aside>
    </DarkOverlay>
  );
};
export default BookingDetails;
