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
  fetchServiceProvidersKpis as fetchServiceProvidersKpisRaw,
  fetchServiceProviderWaitList,
  fetchServiceProviders,
} from '@/app/api/apiClient';
import { useEffect, useState } from 'react';
import TopPerformers from '../components/service-provider/TopPerformers';
import PageLoader from '../components/Loaders/PageLoader';
import useGetOverviewKpis from '@/app/hooks/useGetOverviewKpis';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getKycStatusStyles } from '@/app/lib/accessoryFunctions';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { TableData } from '@/app/types/shared';
import { ServiceProviderTableData } from '@/app/types/service-provider';
import { useRouter } from 'next/navigation';

dayjs.extend(advancedFormat);

const ServiceProviderPage = () => {
  const router = useRouter();
  const [selectedDates, setSelectedDates] = useState<{ minDate: string; maxDate: string }>({
    minDate: '',
    maxDate: '',
  });
  const [serviceProviders, setServiceProviders] = useState<TableData<ServiceProviderTableData>>({
    data: [],
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
  });
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
  // const [serviceTypes, setServiceTypes] = useState<string[]>([]);

  // On mount, sync state with URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setSelectedDates({
        minDate: params.get('minDate') || '',
        maxDate: params.get('maxDate') || '',
      });
    }
  }, []);

  // When selectedDates changes, update the URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (selectedDates.minDate) url.searchParams.set('minDate', selectedDates.minDate);
      else url.searchParams.delete('minDate');
      if (selectedDates.maxDate) url.searchParams.set('maxDate', selectedDates.maxDate);
      else url.searchParams.delete('maxDate');
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [selectedDates, router]);

  // Fetch waitlist
  const { data: waitlistData, isLoading: isWaitlistLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: fetchServiceProviderWaitList,
  });

  // Fetch service providers with date range
  const { data: serviceProviderData, isLoading: isServiceProviderLoading } = useQuery({
    queryKey: ['serviceProviders', 1, 15, selectedDates.minDate, selectedDates.maxDate],
    queryFn: () =>
      fetchServiceProviders(1, 15, '', 'all', selectedDates.minDate, selectedDates.maxDate),
  });

  // Set waitlist when data is loaded
  useEffect(() => {
    if (!isWaitlistLoading && waitlistData) {
      setWaitList(waitlistData.data);
    }
  }, [isWaitlistLoading, waitlistData]);

  // Set service providers and extract unique service types
  useEffect(() => {
    if (serviceProviderData) {
      setServiceProviders({
        ...serviceProviderData,
        totalCount: serviceProviderData.totalProviders,
      });
      // Extract unique service types
      // const types = Array.from(
      //   new Set(
      //     (serviceProviderData.data || [])
      //       .map((item: ServiceProviderTableData) => item.serviceType)
      //       .filter((t: string): t is string => Boolean(t)),
      //   ),
      // ) as string[];
      // setServiceTypes(types);
    }
  }, [serviceProviderData]);

  // Helper to filter by lastLogin within selectedDates
  function isWithinRange(dateStr: string | undefined, min: string, max: string) {
    if (!dateStr) return false;
    if (!min && !max) return true;
    const date = dayjs(dateStr).format('YYYY-MM-DD');
    if (min && max) return date >= min && date <= max;
    if (min) return date >= min;
    if (max) return date <= max;
    return true;
  }

  // Determine if a date range is selected
  const isRangeSelected = selectedDates.minDate !== '' || selectedDates.maxDate !== '';

  // Filter serviceProviders by lastLogin within selectedDates only if a range is selected
  const filteredProviders = isRangeSelected
    ? serviceProviders.data.filter((item) =>
        isWithinRange(
          item.lastLogin as string | undefined,
          typeof selectedDates.minDate === 'string' ? selectedDates.minDate : '',
          typeof selectedDates.maxDate === 'string' ? selectedDates.maxDate : '',
        ),
      )
    : serviceProviders.data;

  // Wrapper to ensure correct date order for KPIs
  const fetchServiceProvidersKpis = (minDate?: string, maxDate?: string) =>
    fetchServiceProvidersKpisRaw(minDate, maxDate);

  // KPIs
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

  return (
    <>
      <PageHeading page='Service Provider' setSelectedDates={setSelectedDates} pageFilters />
      {isServiceProviderLoading || isWaitlistLoading ? (
        <PageLoader />
      ) : (
        <>
          <NumbersOverview
            stats={kpiData}
            className='mt-8'
            isLoading={useFetchOverviewKpis.isLoading}
          />
          {/* Display all unique service types */}
          {/* <div className='mb-4 text-sm text-gray-500'>Service Types: {serviceTypes.join(', ')}</div> */}
          <RecentProviders recentServiceProviders={waitlist} />
          <TopPerformers />
          <PlainTable
            onClickRows={(item) => router.push(`/dashboard/service-provider/${item._id}`)}
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
            data={{ ...serviceProviders, data: filteredProviders }}
            ContentStructure={({ item, index }) => (
              <>
                <td>{index + 1}</td>
                <td>
                  {item.firstName} {item.lastName}
                </td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                {item.serviceType && <td className='capitalize'>{item.serviceType}</td>}
                <td className='capitalize'>{dayjs(item.createdAt).format('MMM DD, YYYY')}</td>
                <td className='capitalize'>{dayjs(item.lastLogin).format('MMM DD, YYYY')}</td>
                {item.kycStatus ? (
                  <td>
                    <Link href={`/dashboard/service-provider/${item._id}`}>
                      <p
                        className={`text-xsmall rounded-[6px] px-[6px] py-[2px] text-center font-medium capitalize ${getKycStatusStyles(
                          item.kycStatus,
                        )}`}
                      >
                        {item.kycStatus || 'Not Verified'}
                      </p>
                    </Link>
                  </td>
                ) : (
                  <td></td>
                )}
              </>
            )}
          />
        </>
      )}
    </>
  );
};
export default ServiceProviderPage;
