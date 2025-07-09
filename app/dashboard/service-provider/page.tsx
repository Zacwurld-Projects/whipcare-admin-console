'use client';
import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import PageHeading from '../components/PageHeading';
import NumbersOverview from '../components/NumbersOverview';
import PlainTable from '../components/tables/PlainTable';
import RecentProviders from '../components/service-provider/RecentProviders';
import { useQuery } from '@tanstack/react-query';
import { fetchServiceProviderWaitList, fetchServiceProviders } from '@/app/api/apiClient';
import { useEffect, useState } from 'react';
import TopPerformers from '../components/service-provider/TopPerformers';
import PageLoader from '../components/Loaders/PageLoader';
import Link from 'next/link';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { TableData } from '@/app/types/shared';
import { ServiceProviderTableData } from '@/app/types/service-provider';
import { useRouter } from 'next/navigation';
import { getKycStatusStyles } from '@/app/lib/accessoryFunctions';

dayjs.extend(advancedFormat);

const ServiceProviderPage = () => {
  const router = useRouter();

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

  const [serviceProviders, setServiceProviders] = useState<TableData<ServiceProviderTableData>>({
    data: [],
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
  });

  const { data: waitlistData, isLoading: isWaitlistLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: fetchServiceProviderWaitList,
  });
  const { data: serviceProviderData, isLoading: isServiceProviderLoading } = useQuery({
    queryKey: ['serviceProviders', 1, 15],
    queryFn: () => fetchServiceProviders(1, 15),
  });

  useEffect(() => {
    if (!isWaitlistLoading && waitlistData) {
      setWaitList(waitlistData.data);
    }
  }, [isWaitlistLoading, waitlistData]);

  useEffect(() => {
    if (serviceProviderData) {
      setServiceProviders({
        ...serviceProviderData,
        totalCount: serviceProviderData.totalProviders,
      });
    }
  }, [serviceProviderData]);

  const kpiData = [
    {
      icon: BagIcon,
      title: 'Number of Service Providers',
      id: 'serviceProvider',
      count: serviceProviderData?.totalProviders ?? 0,
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
  ];

  return (
    <>
      <PageHeading page='Service Provider' pageFilters />
      {isServiceProviderLoading || isWaitlistLoading ? (
        <PageLoader />
      ) : (
        <>
          <NumbersOverview stats={kpiData} className='mt-8' isLoading={isServiceProviderLoading} />
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
            data={serviceProviders}
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
