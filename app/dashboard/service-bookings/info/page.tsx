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
import useGetBookingDetails from '../useGetBookingDetails';
import { ServiceBookingData } from '@/app/types/service-bookings';
import { TableData } from '@/app/types/shared';

dayjs.extend(advancedFormat);
const ServiceBookingInfo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsData, setBookingsData] = useState<TableData<ServiceBookingData>>({
    data: [],
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
  });

  const useFetchBookings = useQuery({
    queryKey: ['fetchServiceBookings', currentPage],
    queryFn: async () => fetchServiceBookings(15, currentPage),
  });

  const { openBookingDetailsModal } = useGetBookingDetails();

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchBookings.isLoading && useFetchBookings.data) setIsInitialLoad(false);
  }, [useFetchBookings.isLoading, useFetchBookings.data]);

  useEffect(() => {
    if (useFetchBookings.data) setBookingsData(useFetchBookings.data);
  }, [useFetchBookings.data]);

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
            heading='Service Bookings List'
            onClickRows={(item) => openBookingDetailsModal(item._id)}
            data={bookingsData}
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
              <>
                <td>{index + 1}</td>
                <td>{item.userName}</td>
                <td>{item.serviceProvider}</td>
                <td>{item.carOwnerPhone}</td>
                <td>{item.orderId}</td>
                <td>{item.serviceType}</td>
                <td className='capitalize'>{dayjs(item.date).format('MMM Do, YYYY')}</td>
                <td>
                  <p
                    className={`text-xsmall w-fit rounded-[6px] px-[6px] py-[2px] text-center font-medium capitalize ${reflectStatusStyle(item.status ? item.status.toLowerCase() : '')}`}
                  >
                    {item.status}
                  </p>
                </td>
              </>
            )}
            search={''}
            onSearch={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        )}
      </div>
    </>
  );
};
export default ServiceBookingInfo;
