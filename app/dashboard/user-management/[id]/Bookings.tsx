'use client';
import { useState } from 'react';
import FilterForm from '../../components/tables/components/FilterForm';
import { formatDateToDDMMYY } from '@/app/lib/accessoryFunctions';
import BookingDetails from '../../components/modals/BookingDetails';
import { Booking } from '@/app/lib/mockTypes';

const tableHeadings = [
  'Booking ID',
  'Booking Date',
  'Phone Number',
  'Location',
  'Service Fee',
  'Status',
];

const tableContent: Booking[] = Array.from({ length: 12 }, (_, i) => {
  return {
    id: '12346WXYZ',
    bookingDate: Date.now() - 20 * 30 * 60 * 60 * 1000,
    phoneNo: '+1 356 786 3732',
    location: '290 m near Grand Play Lekki Lagos',
    status: i > 2 ? 'completed' : 'pending',
    bookingStatus: i > 2 ? 'completed' : '',
    car: 'BMW M6',
    service: 'Mechanic Service',
    serviceType: 'Pick Up Service',
    serviceProvider: 'James Fox',
    brakeServices: '2',
    total: '2.49',
  };
});

const Bookings = () => {
  const [isDisplayingBookingDetails, setIsDisplayingBookingDetails] = useState<{
    display: boolean;
    booking: Booking | null;
  }>({
    display: false,
    booking: null,
  });

  return (
    <>
      <article className='bg-white'>
        <div className='mb-6 flex items-center justify-between px-6 py-3'>
          <h2 className='text-[30px] font-medium text-gray-800'>Bookings History</h2>
          <FilterForm />
        </div>
        <table className='w-full'>
          <thead>
            <tr className=''>
              {tableHeadings.map((item, index) => (
                <th
                  key={item}
                  className={`py-6 text-left font-normal text-gray-500 ${index == 0 ? 'pl-12' : ''}`}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=''>
            {tableContent.map((item, index) => (
              <tr
                key={index}
                className='border-t border-gray-200 [&_td]:py-6 [&_td]:font-medium [&_td]:text-gray-800'
              >
                <td className='pl-12'>{item.id}</td>
                <td>{formatDateToDDMMYY(item.bookingDate)}</td>
                <td>{item.phoneNo}</td>
                <td>{item.location.slice(0, 13)}...</td>
                <td>${item.total}</td>
                <td>
                  <button
                    className={`text-medium w-[124px] rounded-[9.37px] text-center font-medium capitalize ${item.status === 'pending' ? 'bg-primary-50 text-[#ff915b]' : ''} ${item.status === 'cancelled' ? 'bg-[#fbeae9] text-[#dd524d]' : ''} ${item.status === 'completed' || item.status === 'on going' ? 'bg-[#91d6a8] text-[#099137]' : ''}`}
                    onClick={() =>
                      setIsDisplayingBookingDetails({
                        display: true,
                        booking: item,
                      })
                    }
                  >
                    {item.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      {isDisplayingBookingDetails.display && (
        <BookingDetails
          booking={isDisplayingBookingDetails.booking as Booking}
          setIsDisplayingBookingDetails={setIsDisplayingBookingDetails}
        />
      )}
    </>
  );
};
export default Bookings;
