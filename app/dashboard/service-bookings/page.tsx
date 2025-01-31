'use client';
import useGetOverviewKpis from '@/app/hooks/useGetOverviewKpis';
import PageHeading from '../components/PageHeading';
import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import { useState } from 'react';
import { fetchServiceBookings, fetchServiceBookingsKpis } from '@/app/api/apiClient';
import NumbersOverview from '../components/NumbersOverview';
import PlainTable from '../components/tables/PlainTable';
import dayjs from 'dayjs';
import { reflectStatusStyle } from '@/app/lib/accessoryFunctions';
import { useQuery } from '@tanstack/react-query';
import PageLoader from '../components/Loaders/PageLoader';
import advancedFormat from 'dayjs/plugin/advancedFormat';

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

  const useFetchBookings = useQuery({
    queryKey: ['fetchServiceBookings'],
    queryFn: async () => fetchServiceBookings(15, 1),
  });

  const { kpiData, useFetchOverviewKpis } = useGetOverviewKpis(
    serviceBookingsKpi,
    selectedDates,
    fetchServiceBookingsKpis,
  );

  if (useFetchBookings.isLoading) return <PageLoader />;

  return (
    <>
      <PageHeading page='Service Bookings' pageFilters setSelectedDates={setSelectedDates} />
      <NumbersOverview
        stats={kpiData}
        className='my-8'
        isLoading={useFetchOverviewKpis.isLoading}
      />
      <PlainTable
        page='service-bookings'
        heading='Service Booking summary'
        content={useFetchBookings.data.data}
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
    </>
  );
};
export default ServiceBookingsPage;
