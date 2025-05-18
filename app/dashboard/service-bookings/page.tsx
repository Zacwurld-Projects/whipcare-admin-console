'use client';
import useGetOverviewKpis from '@/app/hooks/useGetOverviewKpis';
import PageHeading from '../components/PageHeading';
import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import { useEffect, useState } from 'react';
import { fetchServiceBookings, fetchServiceBookingsKpis } from '@/app/api/apiClient';
import NumbersOverview from '../components/NumbersOverview';
import PlainTable from '../components/tables/PlainTable';
import dayjs from 'dayjs';
import { reflectStatusStyle } from '@/app/lib/accessoryFunctions';
import { useQuery } from '@tanstack/react-query';
import PageLoader from '../components/Loaders/PageLoader';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import useGetBookingDetails from './useGetBookingDetails';
import LineChart from '../components/charts/LineChart';
import { TableData } from '@/app/types/shared';
import { ServiceBookingData } from '@/app/types/service-bookings';

dayjs.extend(advancedFormat);

const serviceBookingsKpi = [
  {
    icon: BagIcon,
    title: 'Total active bookings',
    id: 'activeBooking',
    count: 0,
    growth: 0,
  },
  {
    icon: AllMatchIcon,
    title: 'Total completed bookings',
    id: 'completedBooking',
    count: 0,
    growth: 0,
  },
  {
    icon: CheckCircleIcon,
    title: 'Total cancelled bookings',
    id: 'cancelledBooking',
    count: 0,
    growth: 0,
  },
];

const ServiceBookingsPage = () => {
  const [selectedDates, setSelectedDates] = useState({
    maxDate: '',
    minDate: '',
  });
  const [bookingsData, setBookingsData] = useState<TableData<ServiceBookingData>>({
    data: [],
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
  });

  const useFetchBookings = useQuery({
    queryKey: ['fetchServiceBookings'],
    queryFn: async () => fetchServiceBookings(15, 1),
  });

  const { kpiData, useFetchOverviewKpis } = useGetOverviewKpis(
    serviceBookingsKpi,
    selectedDates,
    fetchServiceBookingsKpis,
  );

  const { openBookingDetailsModal } = useGetBookingDetails();

  useEffect(() => {
    if (useFetchBookings.data) setBookingsData(useFetchBookings.data);
  }, [useFetchBookings.data]);

  if (useFetchBookings.isLoading) return <PageLoader />;
  return (
    <>
      <PageHeading page='Service Bookings' pageFilters setSelectedDates={setSelectedDates} />
      <NumbersOverview
        stats={kpiData}
        className='my-8'
        isLoading={useFetchOverviewKpis.isLoading}
      />
      <div className='mb-12 flex w-full flex-col items-center gap-[18px] *:flex-1 min-[850px]:flex-row'>
        <LineChart heading='Revenue' className='w-full min-[850px]:w-1/2' />
        <LineChart className='w-full min-[850px]:w-1/2' filter heading='Booking Summary' />
      </div>
      <PlainTable
        page='service-bookings'
        heading='Service Booking summary'
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
        onClickRows={(item) => openBookingDetailsModal(item._id)}
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
      />
    </>
  );
};
export default ServiceBookingsPage;
