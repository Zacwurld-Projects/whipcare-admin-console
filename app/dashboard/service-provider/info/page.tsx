'use client';
import PageHeading from '../../components/PageHeading';
import { ServiceProviderTableData } from '@/app/types/service-provider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchServiceProviders } from '@/app/api/apiClient';
import InfoTable from '../../components/tables/InfoTable';
import dayjs from 'dayjs';
import { reflectStatusStyle } from '@/app/lib/accessoryFunctions';
import Link from 'next/link';

const PAGE_SIZE = 15;

const ServiceProviderInfo = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: serviceProviderData, isLoading: isServiceProviderLoading } = useQuery({
    queryKey: ['serviceProviders', currentPage, search],
    queryFn: () => fetchServiceProviders(currentPage, PAGE_SIZE, search),
  });

  const serviceProviders = serviceProviderData
    ? {
        ...serviceProviderData,
        totalCount: serviceProviderData.totalProviders,
      }
    : {
        data: [],
        pageNumber: currentPage,
        pageSize: PAGE_SIZE,
        totalCount: 0,
      };

  const mappedProviders = {
    ...serviceProviders,
    data: serviceProviders.data.map((item: ServiceProviderTableData) => ({
      ...item,
      phone: item.phone ?? undefined,
      firstName: item.firstName ?? undefined,
      lastName: item.lastName ?? undefined,
      email: item.email ?? undefined,
      createdAt: item.createdAt ?? undefined,
      services: item.services ?? [],
      _id: item._id,
      lastLogin: item.lastLogin ?? undefined,
      kycStatus: item.kycStatus ?? undefined,
    })),
  };

  return (
    <>
      <PageHeading page='Service Provider' pageFilters />
      <div className='mt-6 w-full'>
        <InfoTable
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoading={isServiceProviderLoading}
          onClickRows={(item: ServiceProviderTableData) =>
            router.push(`/dashboard/service-provider/${item._id}`)
          }
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
          data={mappedProviders}
          search={search}
          onSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          ContentStructure={({
            item,
            index,
          }: {
            item: ServiceProviderTableData;
            index: number;
          }) => (
            <>
              <td>{index + 1 + PAGE_SIZE * (currentPage - 1)}</td>
              <td>
                {item.firstName} {item.lastName}
              </td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td className='capitalize'>
                {item.services && item.services.length > 0 ? item.services[0] : ''}
              </td>
              <td className='capitalize'>
                {item.createdAt ? dayjs(item.createdAt).format('MMM DD, YYYY') : ''}
              </td>
              <td className='capitalize'>
                {item.lastLogin ? dayjs(item.lastLogin).format('MMM DD, YYYY') : ''}
              </td>
              {item.kycStatus ? (
                <td>
                  <Link href={`/dashboard/service-provider/${item._id}`}>
                    <p
                      className={`text-xsmall rounded-[6px] px-[6px] py-[2px] text-center font-medium capitalize ${reflectStatusStyle(item.kycStatus)}`}
                    >
                      {item.kycStatus}
                    </p>
                  </Link>
                </td>
              ) : (
                <td></td>
              )}
            </>
          )}
        />
      </div>
    </>
  );
};
export default ServiceProviderInfo;
