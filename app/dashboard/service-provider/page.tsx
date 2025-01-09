'use client';
import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import PageHeading from '../components/PageHeading';
import NumbersOverview from '../components/NumbersOverview';
import PlainTable from '../components/tables/PlainTable';
import RecentProviders from '../components/service-provider/RecentProviders';
import { useQuery } from '@tanstack/react-query';
import {
  fetchServiceProvidersKpis,
  fetchServiceProviderWaitList,
  fetchServiceProviders,
} from '@/app/api/apiClient';
import { useEffect, useState } from 'react';
import TopPerformers from '../components/service-provider/TopPerformers';
import PageLoader from '../components/Loaders/PageLoader';
import useGetOverviewKpis from '@/app/hooks/useGetOverviewKpis';

const ServiceProviderPage = () => {
  const [selectedDates, setSelectedDates] = useState({
    maxDate: '',
    minDate: '',
  });

  const { kpiData, useFetchOverviewKpis } = useGetOverviewKpis(
    [
      {
        icon: BagIcon,
        title: 'Number of Service Providers',
        id: 'serviceProvider',
        count: 0,
        growth: 0,
      },
      {
        icon: AllMatchIcon,
        title: 'Number of Active Service Providers',
        id: 'activeServiceProvider',
        count: 0,
        growth: 0,
      },
      {
        icon: CheckCircleIcon,
        title: 'Number of Inactive Service Providers',
        id: 'inActiveServiceProvider',
        count: 0,
        growth: 0,
      },
    ],
    selectedDates,
    fetchServiceProvidersKpis,
  );

  const [waitlist, setWaitList] = useState(
    Array.from({ length: 7 }, () => {
      return {
        _id: '5656566',
        firstName: 'Ariana',
        lastName: 'Bush',
        image: null,
        email: 'arianabush@gmail.com',
      };
    }),
  );

  const [serviceProviders, setServiceProviders] = useState<
    Array<{
      _id: string;
      email: string;
      image: null | string;
      firstName: string;
      lastName: string;
      phone: null | string;
      lastLogin: string;
      createdAt: string;
      services: string[];
    }>
  >([]);

  const { data: waitlistData, isLoading: isWaitlistLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: fetchServiceProviderWaitList,
  });
  const { data: serviceProviderData, isLoading: isServiceProviderLoadng } = useQuery({
    queryKey: ['serviceProviders', 1, 15],
    queryFn: () => fetchServiceProviders(1, 15),
  });

  useEffect(() => {
    if (!isWaitlistLoading && waitlistData) {
      setWaitList(waitlistData.data);
    }
  }, [isWaitlistLoading, waitlistData]);

  useEffect(() => {
    if (!isServiceProviderLoadng && serviceProviderData) {
      setServiceProviders(serviceProviderData.data);
    }
  }, [isServiceProviderLoadng, serviceProviderData]);

  return (
    <>
      <PageHeading page='Service Provider' setSelectedDates={setSelectedDates} pageFilters />
      {isServiceProviderLoadng || isWaitlistLoading ? (
        <PageLoader />
      ) : (
        <>
          <NumbersOverview
            stats={kpiData}
            className='mt-8'
            isLoading={useFetchOverviewKpis.isLoading}
          />
          <RecentProviders recentServiceProviders={waitlist} />
          <TopPerformers />
          <PlainTable
            page='service-provider'
            heading='Service Providers Info'
            headings={[
              'No',
              'Name',
              'Email address',
              'Phone',
              'Service Type',
              'Sign up Date',
              'Last Login Date',
              'Status',
            ]}
            content={serviceProviders}
          />
        </>
      )}
    </>
  );
};
export default ServiceProviderPage;
