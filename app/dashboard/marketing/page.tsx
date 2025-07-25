'use client';

import { fetchMarketingEmailList } from '@/app/api/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import InfoTable from '../components/tables/InfoTable';
import { BaseTable, BaseTableData } from '@/app/lib/mockTypes';
import dayjs from '@/app/dayjs';
import PageLoader from '../components/Loaders/PageLoader';

type EmailData = BaseTableData & {
  type: string;
  createdAt: string;
};

const EmailListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const useFetchEmails = useQuery({
    queryKey: ['fetchEmailList'],
    queryFn: () => fetchMarketingEmailList(currentPage, 15),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchEmails.isLoading && useFetchEmails.data) setIsInitialLoad(false);
  }, [useFetchEmails.isLoading, useFetchEmails.data]);

  if (isInitialLoad && useFetchEmails.isLoading) return <PageLoader />;

  return (
    <section>
      <InfoTable
        onFilterClick={() => {}}
        heading='Email List'
        headings={['No', 'User Name', 'User Type', 'Email address', 'Date Registered']}
        data={useFetchEmails.data as BaseTable<EmailData>}
        showItemNumber
        isLoading={useFetchEmails.isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        ContentStructure={({ item }) => {
          return (
            <>
              <td>
                {item.firstName} {item.lastName}
              </td>
              <td>{item.type}</td>
              <td>{item.email}</td>
              <td>{dayjs(item.createdAt).format('MMM Do, YYYY')}</td>
            </>
          );
        }}
        search={''}
        onSearch={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </section>
  );
};
export default EmailListPage;
