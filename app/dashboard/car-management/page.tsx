'use client';
import PageHeading from '../components/PageHeading';
import BagIcon from '../assets/bagIcon.svg';
import AllMatchIcon from '../assets/allMatchIcon.svg';
import CheckCircleIcon from '../assets/checkCircleIcon.svg';
import NumbersOverview from '../components/NumbersOverview';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useGetOverviewKpis from '@/app/hooks/useGetOverviewKpis';
import { fetchCarMangemntKpis, fetchCars } from '@/app/api/apiClient';
import PageLoader from '../components/Loaders/PageLoader';
import InfoTable from '../components/tables/InfoTable';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { BaseTable, BaseTableData } from '@/app/lib/mockTypes';

dayjs.extend(advancedFormat);

type CarData = BaseTableData & {
  carBrand: string | null;
  carModel: string | null;
  colour: string | null;
  lastService: string | null;
  lastServiceDate: string | null;
};

const carManagementStats = [
  {
    icon: BagIcon,
    title: 'Number of Registered Cars',
    id: 'registeredCarsr',
    count: 0,
    growth: 0,
  },
  {
    icon: AllMatchIcon,
    title: 'Number of Active Cars',
    id: 'activeCars',
    count: 0,
    growth: 0,
  },
  {
    icon: CheckCircleIcon,
    title: 'Number of Newly Added Cars',
    id: 'newlyAddedCars',
    count: 0,
    growth: 0,
  },
];
const CarManagementPage = () => {
  const [selectedDates, setSelectedDates] = useState({
    maxDate: '',
    minDate: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { kpiData, useFetchOverviewKpis } = useGetOverviewKpis(
    carManagementStats,
    selectedDates,
    fetchCarMangemntKpis,
  );

  const useFetchCarList = useQuery({
    queryKey: ['fetchCarList', currentPage],
    queryFn: () => fetchCars(undefined, currentPage),
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!useFetchCarList.isLoading && useFetchCarList.data) setIsInitialLoad(false);
  }, [useFetchCarList.isLoading, useFetchCarList.data]);

  if (isInitialLoad) return <PageLoader />;

  return (
    <>
      <PageHeading page='Car Management' pageFilters setSelectedDates={setSelectedDates} />
      <NumbersOverview
        stats={kpiData}
        isLoading={useFetchOverviewKpis.isLoading}
        className='my-8'
      />
      <InfoTable
        heading='Registered Car List'
        isLoading={useFetchCarList.isLoading}
        data={useFetchCarList.data as BaseTable<CarData>}
        headings={[
          'No',
          'Car Brand',
          'Car Model/Year',
          'Color',
          'User Name',
          'Last Service',
          'Date Booked',
        ]}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        ContentStructure={({ item, index }) => (
          <>
            <td>{index + 1}</td>
            <td>{item.carBrand}</td>
            <td>{item.carModel}</td>
            <td>{item.colour}</td>
            <td>
              {item.firstName} {item.lastName}
            </td>
            <td>{item.lastService}</td>
            <td>
              {item.lastServiceDate ? dayjs(item.lastServiceDate).format('MMM Do, YYYY') : ''}
            </td>
          </>
        )}
        search={''}
        onSearch={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </>
  );
};
export default CarManagementPage;
