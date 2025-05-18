'use client';
import PageHeading from '../../components/PageHeading';
import { TableData } from '@/app/types/shared';
import { ServiceProviderTableData } from '@/app/types/service-provider';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchServiceProviders } from '@/app/api/apiClient';
import InfoTable from '../../components/tables/InfoTable';
import dayjs from 'dayjs';
import { reflectStatusStyle } from '@/app/lib/accessoryFunctions';
import Link from 'next/link';
import SectionLoader from '../../components/Loaders/SectionLoader';

const ServiceProviderInfo = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceProviders, setServiceProviders] = useState<TableData<ServiceProviderTableData>>({
    data: [],
    pageNumber: 0,
    pageSize: 0,
    totalCount: 0,
  });

  const { data: serviceProviderData, isLoading: isServiceProviderLoadng } = useQuery({
    queryKey: ['serviceProviders', currentPage, 15],
    queryFn: () => fetchServiceProviders(currentPage, 15),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isServiceProviderLoadng && serviceProviderData) setIsInitialLoad(false);
  }, [isServiceProviderLoadng, serviceProviderData]);

  useEffect(() => {
    if (serviceProviderData) {
      setServiceProviders(serviceProviderData);
    }
  }, [serviceProviderData]);

  return (
    <>
      <PageHeading page='Service Provider' pageFilters />
      <div className='mt-6 w-full'>
        {isInitialLoad ? (
          <SectionLoader height='70vh' />
        ) : (
          <InfoTable
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={isServiceProviderLoadng}
            onClickRows={(item) => router.push(`/dashboard/service-provider/${item._id}`)}
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
                {item.services && <td className='capitalize'>{item.services[0]}</td>}
                <td className='capitalize'>{dayjs(item.createdAt).format('MMM Do, YYYY')}</td>
                <td className='capitalize'>{dayjs(item.lastLogin).format('MMM Do, YYYY')}</td>
                {item.status ? (
                  <td>
                    <Link href={`/dashboard/service-provider/${item._id}`}>
                      <p
                        className={`text-xsmall rounded-[6px] px-[6px] py-[2px] text-center font-medium capitalize ${reflectStatusStyle(item.status)}`}
                      >
                        {item.status}
                      </p>
                    </Link>
                  </td>
                ) : (
                  <td></td>
                )}
              </>
            )}
          />
        )}
      </div>
    </>
  );
};
export default ServiceProviderInfo;
