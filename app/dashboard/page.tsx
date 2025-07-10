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

  return (
    <>
      <PageHeading page='overview' pageFilters setSelectedDates={setSelectedDates} />
      <NumbersOverview
        stats={kpiData}
        className='mt-8'
        isLoading={useFetchOverviewKpis.isLoading}
      />
      <div className='mt-6 grid grid-cols-1 gap-6 min-[750px]:grid-cols-2'>
        <BarChart
          yLabel='Amount(Thousands)'
          xLabels={['Mech/Tech', 'Wash', 'Hauling', 'Detailing']}
          heading='Revenue'
          data={[850, 950, 600, 600]}
        />
        <ProgressBarChart
          heading='Service Efficiency'
          timestamp={Date.now() - 30 * 24 * 60 * 60 * 1000}
        />
        <BarChart
          yLabel='Users'
          xLabels={['Mech/Tech', 'Wash', 'Hauling', 'Detailing']}
          heading='Service Type'
          data={[830, 980, 670, 600]}
        />
        <DoughnutChart
          heading='Payment method'
          colors={['#f56630', '#0f973d']}
          data={[4000000, 2000000]}
          xLabels={['Transfer', 'Card']}
          yLabel='Amount Paid'
          timestamp={Date.now() - 30 * 24 * 60 * 60 * 1000}
        />
      </div>
    </>
  );
};
export default Overview;
