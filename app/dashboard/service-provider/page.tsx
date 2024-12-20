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
import { ComponentType, useEffect, useState } from 'react';
import TopPerformers from '../components/service-provider/TopPerformers';
import PageLoader from '../components/PageLoader';

const ServiceProviderPage = () => {
  const [serviceProviderStats, setServiceProviderStats] = useState<
    Array<{ icon: ComponentType; title: string; currentNumber: number; previousNumber: number }>
  >([
    {
      icon: BagIcon,
      title: 'Number of Service Providers',
      currentNumber: 0,
      previousNumber: 0,
    },
    {
      icon: AllMatchIcon,
      title: 'Number of Active Service Providers',
      currentNumber: 0,
      previousNumber: 0,
    },
    {
      icon: CheckCircleIcon,
      title: 'Number of Inactive Service Providers',
      currentNumber: 0,
      previousNumber: 0,
    },
  ]);

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

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['serviceProviderKPIs'],
    queryFn: fetchServiceProvidersKpis,
  });
  const { data: waitlistData, isLoading: isWaitlistLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: fetchServiceProviderWaitList,
  });
  const { data: serviceProviderData, isLoading: isServiceProviderLoadng } = useQuery({
    queryKey: ['serviceProviders', 1, 15],
    queryFn: () => fetchServiceProviders(1, 15),
  });

  useEffect(() => {
    if (!isStatsLoading && statsData) {
      const {
        data: {
          numberOfServiceProviders,
          numberOfActiveServiceProviders,
          numberOfInActiveServiceProviders,
        },
      } = statsData;
      setServiceProviderStats((prev) =>
        prev.map((item) => {
          if (item.title === 'Number of Service Providers')
            return {
              ...item,
              currentNumber: numberOfServiceProviders,
              previousNumber: numberOfServiceProviders,
            };
          if (item.title === 'Number of Active Service Providers')
            return {
              ...item,
              currentNumber: numberOfActiveServiceProviders,
              previousNumber: numberOfActiveServiceProviders,
            };
          if (item.title === 'Number of Inactive Service Providers')
            return {
              ...item,
              currentNumber: numberOfInActiveServiceProviders,
              previousNumber: numberOfInActiveServiceProviders,
            };
          return item;
        }),
      );
    }
  }, [isStatsLoading, statsData]);

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

  // if (isServiceProviderLoadng || isStatsLoading || isWaitlistLoading) {
  //   return <PageLoader />;
  // }

  return (
    <>
      <PageHeading page='Service Provider' pageFilters />
      {isServiceProviderLoadng || isStatsLoading || isWaitlistLoading ? (
        <PageLoader />
      ) : (
        <>
          <NumbersOverview stats={serviceProviderStats} className='mt-8' />
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
