'use client';

import React from 'react';
import PageHeading from '../../components/PageHeading';
import InfoTable from '../../components/tables/InfoTable';
import { fetchServiceProviderWaitList } from '@/app/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { WaitlistData } from '@/app/lib/mockTypes';

const Page = () => {
  const { data: waitlistData, isLoading: isWaitlistLoading } = useQuery<{
    data: WaitlistData[];
    totalCount: number;
  }>({
    queryKey: ['waitlist'],
    queryFn: fetchServiceProviderWaitList,
  });

  return (
    <div>
      <PageHeading page='Waitlist Providers' pageFilters />
      <div className='mt-5'>
        <InfoTable
          heading='Waitlist Service Providers'
          headings={[
            'No',
            'Name',
            'Email Address',
            'Address',
            'Phone number',
            'Service type',
            'City',
          ]}
          onFilterClick={() => {}}
          isLoading={isWaitlistLoading}
          data={{
            data: waitlistData?.data || [],
            totalCount: waitlistData?.totalCount || waitlistData?.data?.length || 0,
            pageNumber: 1,
            pageSize: 10,
          }}
          currentPage={1}
          setCurrentPage={() => {}}
          showItemNumber={true}
          emptyStateProps={{
            icon: <span className='text-gray-500'>No data available</span>,
            title: 'No waitlist service providers found',
            subText: 'Please check back later.',
          }}
          search=''
          onSearch={() => {}}
          onClickRows={() => {}}
          ContentStructure={({ item }) => (
            <>
              <td>{item.fullName}</td>
              <td>{item.email}</td>
              <td>{item.address}</td>
              <td>{item.phone}</td>
              <td>{item.role}</td>
              <td>{item.city}</td>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default Page;
