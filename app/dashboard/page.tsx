'use client';
import PageHeading from './components/PageHeading';
import BagIcon from './assets/bagIcon.svg';
import AllMatchIcon from './assets/allMatchIcon.svg';
import CheckCircleIcon from './assets/checkCircleIcon.svg';
import NumbersOverview from './components/NumbersOverview';
import BarChart from './components/charts/BarChart';
import DoughnutChart from './components/charts/DoughnutChart';
import ProgressBarChart from './components/charts/ProgressBarChart';
import { fetchOverViewKpis } from '../api/apiClient';
import { useState } from 'react';
import useGetOverviewKpis from '../hooks/useGetOverviewKpis';
import useGetOverviewCharts from '../hooks/useGetOverviewCharts';

const Overview = () => {
  const [selectedDates, setSelectedDates] = useState({
    maxDate: '',
    minDate: '',
  });

  const { kpiData, useFetchOverviewKpis } = useGetOverviewKpis(
    [
      {
        icon: BagIcon,
        title: 'Number of bookings',
        id: 'booking',
        count: 0,
        growth: 0,
      },
      {
        icon: AllMatchIcon,
        title: 'Booking acceptance',
        id: 'acceptedBooking',
        count: 0,
        growth: 0,
      },
      {
        icon: CheckCircleIcon,
        title: 'New user sign up',
        id: 'signup',
        count: 0,
        growth: 0,
      },
    ],
    selectedDates,
    fetchOverViewKpis,
  );

  const { revenue, serviceType, paymentMethod, serviceEfficiency } = useGetOverviewCharts();

  return (
    <>
      <PageHeading page='overview' pageFilters setSelectedDates={setSelectedDates} />
      <NumbersOverview
        stats={kpiData}
        className='mt-8'
        isLoading={useFetchOverviewKpis.isLoading || useFetchOverviewKpis.isFetching}
      />
      <div className='mt-6 grid grid-cols-1 gap-6 min-[750px]:grid-cols-2'>
        <BarChart
          yLabel='Amount'
          xLabels={revenue.labels}
          heading='Revenue'
          data={revenue.values}
        />
        <ProgressBarChart
          heading='Service Efficiency'
          timestamp={Date.now() - 30 * 24 * 60 * 60 * 1000}
          data={serviceEfficiency.items}
          isLoading={serviceEfficiency.isLoading}
        />
        <BarChart
          yLabel='Users'
          xLabels={serviceType.labels}
          heading='Service Type'
          data={serviceType.values}
        />
        <DoughnutChart
          heading='Payment method'
          colors={paymentMethod.colors}
          data={paymentMethod.values}
          xLabels={paymentMethod.labels}
          yLabel='Amount Paid'
          timestamp={paymentMethod.timestamp}
        />
      </div>
    </>
  );
};
export default Overview;
