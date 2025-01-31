'use client';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import PageHeading from '../../components/PageHeading';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchServiceBookings } from '@/app/api/apiClient';
import InfoTable from '../../components/tables/InfoTable';
import { reflectStatusStyle } from '@/app/lib/accessoryFunctions';
import SectionLoader from '../../components/Loaders/SectionLoader';

dayjs.extend(advancedFormat);

const ServiceBookingInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const useFetchBookings = useQuery({
    queryKey: ['fetchServiceBookings', currentPage],
    queryFn: async () => fetchServiceBookings(15, currentPage),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchBookings.isLoading && useFetchBookings.data) setIsInitialLoad(false);
  }, [useFetchBookings.isLoading, useFetchBookings.data]);

  return (
    <>
      <PageHeading page='Service Bookings' />
      <div className='mt-8 w-full'>
        {isInitialLoad ? (
          <SectionLoader height='70vh' />
        ) : (
          <InfoTable
            isLoading={useFetchBookings.isLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            heading='Service Booking summary'
            data={useFetchBookings.data}
            headings={[
              'No',
              'User name',
              'Service provider',
              'Phone',
              'Order ID',
              'Service Type',
              'Date',
              'Status',
            ]}
            ContentStructure={({ item, index }) => (
              <tr
                key={index}
                className='[&_td]:text-xsmall border-y border-y-gray-75 [&_td]:px-[14px] [&_td]:py-3 [&_td]:font-medium [&_td]:text-gray-800'
              >
                <td>{index + 1}</td>
                <td>{item.userName}</td>
                <td>{item.serviceProvider}</td>
                <td>{item.carOwnerPhone}</td>
                <td>
                  <button className='hover:underline'>{item.orderId}</button>
                </td>
                <td>{item.serviceType}</td>
                <td className='capitalize'>{dayjs(item.date).format('MMM Do, YYYY')}</td>
                <td>
                  <button>
                    <p
                      className={`text-xsmall w-fit rounded-[6px] px-[6px] py-[2px] text-center font-medium capitalize ${reflectStatusStyle(item.status ? item.status.toLowerCase() : '')}`}
                    >
                      {item.status}
                    </p>
                  </button>
                </td>
              </tr>
            )}
          />
        )}
      </div>
    </>
  );
};
export default ServiceBookingInfo;
