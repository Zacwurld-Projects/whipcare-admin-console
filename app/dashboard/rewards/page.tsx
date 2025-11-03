'use client';

import React, { useState } from 'react';
import RewardCenterForm from '../cron/RewardCenterForm';
import InfoTable from '../components/tables/InfoTable';
import { useQuery } from '@tanstack/react-query';
import { fetchRewardCenters } from '@/app/api/apiClient';
import { TableData } from '@/app/types/shared';
import PageLoader from '../components/Loaders/PageLoader';
import PageHeading from '../components/PageHeading';

interface RewardCenter {
  name: string;
  description: string;
  audience: string;
  category: string;
  action: string;
  value: number;
  valueType: string;
  trigger: string;
  triggerCondition: { count?: number };
  status: string;
}

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery<
    TableData<RewardCenter>,
    Error,
    TableData<RewardCenter>,
    (string | number)[]
  >({
    queryKey: ['rewardCenters', currentPage, search],
    queryFn: () => fetchRewardCenters(currentPage, 10),
  });

  if (isLoading) {
    return (
      <div>
        <PageLoader />
      </div>
    );
  }
  if (isError) return <div>Error loading reward centers.</div>;

  const headings = [
    'S/N',
    'Reward Title',
    'Audience',
    'Category',
    'Action',
    'Value',
    'Value Type',
    'Trigger',
    'Trigger Count',
    'Status',
  ];

  const RewardCenterRow = ({ item }: { item: RewardCenter }) => (
    <>
      <td>{item.name}</td>
      <td>{item.audience}</td>
      <td>{item.category}</td>
      <td>{item.action}</td>
      <td>{item.value}</td>
      <td>{item.valueType}</td>
      <td>{item.trigger}</td>
      <td>{item.triggerCondition?.count || null}</td>
      <td>{item.status}</td>
    </>
  );

  return (
    <div>
      <div className='py-5'>
        <PageHeading page='Reward Center' />
      </div>

      <RewardCenterForm />

      <div>
        <InfoTable
          heading='Reward Centers'
          data={data || { data: [], totalCount: 0, pageSize: 10, pageNumber: 1 }}
          headings={headings}
          ContentStructure={RewardCenterRow}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          search={search}
          onSearch={setSearch}
          onFilterClick={() => {}}
          isLoading={isLoading}
          showItemNumber={true}
        />
      </div>
    </div>
  );
};

export default Page;
