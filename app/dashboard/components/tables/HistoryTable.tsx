'use client';
import { useState } from 'react';
import FilterForm from './components/FilterForm';
import { formatDateToDDMMYY } from '@/app/lib/accessoryFunctions';
import BookingDetails from '../modals/BookingDetails';
import { Booking } from '@/app/lib/mockTypes';

const HistoryTable = ({
  type,
  tableHeadings,
  heading,
  tableContent,
}: {
  type: string;
  tableHeadings: string[];
  heading: string;
  tableContent: Booking[];
}) => {
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
          <h2 className='text-[30px] font-medium text-gray-800'>{heading}</h2>
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
                {tableHeadings.includes('fee') ? (
                  <td>${item.total}</td>
                ) : (
                  <td>{item.serviceType}</td>
                )}
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
          type={type}
          booking={isDisplayingBookingDetails.booking as Booking}
          setIsDisplayingBookingDetails={setIsDisplayingBookingDetails}
        />
      )}
    </>
  );
};
export default HistoryTable;
