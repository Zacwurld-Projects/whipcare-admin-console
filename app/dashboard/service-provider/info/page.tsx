'use client';
import PageHeading from '../../components/PageHeading';
import { ServiceProviderTableData } from '@/app/types/service-provider';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchServiceProviders } from '@/app/api/apiClient';
import InfoTable from '../../components/tables/InfoTable';
import dayjs from 'dayjs';
import { getKycStatusStyles } from '@/app/lib/accessoryFunctions';
import Link from 'next/link';
import FilterModal from '../../components/modals/FilterModal';

const PAGE_SIZE = 15;

const ServiceProviderInfo = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState('all');
  const [selectedDates, setSelectedDates] = useState<{ minDate: string; maxDate: string }>({
    minDate: '',
    maxDate: '',
  });

  // On mount, sync state with URL params (client only)
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setSearch(params.get('search') || '');
      setStatus(params.get('status') || 'all');
      setSelectedDates({
        minDate: params.get('minDate') || '',
        maxDate: params.get('maxDate') || '',
      });
      const pageParam = params.get('pageNumber');
      setCurrentPage(pageParam ? parseInt(pageParam, 10) || 1 : 1);
    }
  }, []);

  // Debounce search and update URL
  const searchRef = useRef(search);
  useEffect(() => {
    searchRef.current = search;
    if (!isClient) return;
    const handler = setTimeout(() => {
      const url = new URL(window.location.href);
      if (searchRef.current && searchRef.current !== '')
        url.searchParams.set('search', searchRef.current);
      else url.searchParams.delete('search');
      if (status && status !== 'all') url.searchParams.set('status', status);
      else url.searchParams.delete('status');
      if (selectedDates.minDate) url.searchParams.set('minDate', selectedDates.minDate);
      else url.searchParams.delete('minDate');
      if (selectedDates.maxDate) url.searchParams.set('maxDate', selectedDates.maxDate);
      else url.searchParams.delete('maxDate');
      url.searchParams.set('pageNumber', String(currentPage));
      router.replace(url.pathname + url.search, { scroll: false });
    }, 300);
    return () => clearTimeout(handler);
  }, [search, status, selectedDates.minDate, selectedDates.maxDate, currentPage, isClient, router]);

  // Update filters and reset page
  const handleFilterApply = (filters: { status: string; minDate?: string; maxDate?: string }) => {
    if (filters.minDate && filters.maxDate && dayjs(filters.minDate).isAfter(filters.maxDate)) {
      alert('Start date cannot be after end date');
      return;
    }
    setStatus(filters.status);
    setSelectedDates({
      minDate: filters.minDate ?? '',
      maxDate: filters.maxDate ?? '',
    });
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Determine if filters are active
  const isFilterActive =
    status !== 'all' || selectedDates.minDate || selectedDates.maxDate || search;

  // Fetch all data when filters are active, otherwise fetch paginated data
  const { data: serviceProviderData, isLoading: isServiceProviderLoading } = useQuery({
    queryKey: [
      'serviceProviders',
      isFilterActive ? 'filtered' : currentPage,
      search,
      status,
      selectedDates.minDate,
      selectedDates.maxDate,
    ],
    queryFn: () =>
      fetchServiceProviders(
        isFilterActive ? 1 : currentPage,
        isFilterActive ? Number.MAX_SAFE_INTEGER : PAGE_SIZE, // Fetch all data when filtered
        search,
        status,
        selectedDates.minDate,
        selectedDates.maxDate,
      ),
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
      serviceType: item.serviceType ?? [],
      _id: item._id,
      lastLogin: item.lastLogin ?? undefined,
      kycStatus: item.kycStatus ?? undefined,
    })),
  };

  // Helper to filter by lastLogin within a date range
  function isWithinRange(dateStr: string | undefined, min: string, max: string) {
    if (!dateStr) return false;
    if (!min && !max) return true;
    const date = dayjs(dateStr).format('YYYY-MM-DD');
    if (min && max) return date >= min && date <= max;
    if (min) return date >= min;
    if (max) return date <= max;
    return true;
  }

  const isRangeSelected = selectedDates.minDate !== '' || selectedDates.maxDate !== '';

  const filteredProviders = isRangeSelected
    ? mappedProviders.data.filter((item: ServiceProviderTableData) =>
        isWithinRange(
          item.lastLogin as string | undefined,
          typeof selectedDates.minDate === 'string' ? selectedDates.minDate : '',
          typeof selectedDates.maxDate === 'string' ? selectedDates.maxDate : '',
        ),
      )
    : mappedProviders.data;

  const filteredData =
    status && status !== 'all'
      ? filteredProviders.filter((item: { kycStatus: string }) => item.kycStatus === status)
      : filteredProviders;

  // Apply pagination to filtered data if it exceeds PAGE_SIZE
  const paginatedFilteredData = isFilterActive
    ? filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : filteredData;

  const filteredMappedProviders = {
    ...mappedProviders,
    data: isFilterActive ? paginatedFilteredData : filteredData,
    pageSize: PAGE_SIZE,
    totalCount: isFilterActive ? filteredData.length : mappedProviders.totalCount,
  };

  return (
    <>
      <PageHeading
        page='Service Provider'
        pageFilters
        setSelectedDates={setSelectedDates}
        selectedStartDate={selectedDates.minDate}
        selectedEndDate={selectedDates.maxDate}
      />
      <div className='mb-4 flex justify-end'></div>
      {showFilter && (
        <FilterModal
          onClose={() => setShowFilter(false)}
          onApply={handleFilterApply}
          initialStatus={status}
          initialMinDate={selectedDates.minDate}
          initialMaxDate={selectedDates.maxDate}
        />
      )}
      <div className='mt-6 w-full'>
        {isClient && (
          <InfoTable
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
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
            data={filteredMappedProviders}
            search={search}
            onSearch={handleSearch}
            onFilterClick={() => setShowFilter(true)}
            ContentStructure={({ item, index }) => (
              <>
                <td>
                  {index +
                    1 +
                    (isFilterActive
                      ? (currentPage - 1) * PAGE_SIZE
                      : (currentPage - 1) * PAGE_SIZE)}
                </td>
                <td>
                  {item.firstName} {item.lastName}
                </td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td className='capitalize'>{item.serviceType || ''}</td>
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
                        className={`text-xsmall rounded-[6px] px-[6px] py-[2px] text-center font-medium capitalize ${getKycStatusStyles(item.kycStatus)}`}
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
        )}
      </div>
    </>
  );
};

export default ServiceProviderInfo;
