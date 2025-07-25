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
  // const searchParams =
  //   typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  // Helper to get param from URL
  // const getParam = (key: string, fallback: string = ''): string => {
  //   if (!searchParams) return fallback;
  //   return searchParams.get(key) || fallback;
  // };

  // State for filters and pagination
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

  // Update URL when filters or page change
  // const updateUrl = (params: Record<string, string | number | undefined>) => {
  //   const url = new URL(window.location.href);
  //   Object.entries(params).forEach(([key, value]) => {
  //     if (value !== undefined && value !== '' && !(key === 'status' && value === 'all'))
  //       url.searchParams.set(key, String(value));
  //     else url.searchParams.delete(key);
  //   });
  //   router.replace(url.pathname + url.search, { scroll: false });
  // };

  // Update URL on filter/page/search change
  const handleFilterApply = (filters: { status: string; minDate?: string; maxDate?: string }) => {
    setStatus(filters.status);
    setSelectedDates({
      minDate: filters.minDate ?? '', // first date input is minDate
      maxDate: filters.maxDate ?? '', // second date input is maxDate
    });
    setCurrentPage(1);
  };
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { data: serviceProviderData, isLoading: isServiceProviderLoading } = useQuery({
    queryKey: [
      'serviceProviders',
      currentPage,
      search,
      status,
      selectedDates.minDate,
      selectedDates.maxDate,
    ],
    queryFn: () =>
      fetchServiceProviders(
        currentPage,
        PAGE_SIZE,
        search,
        status,
        selectedDates.minDate,
        selectedDates.maxDate,
      ),
    enabled: isClient, // Only fetch on client
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

  // Determine if a date range is selected
  const isRangeSelected = selectedDates.minDate !== '' || selectedDates.maxDate !== '';

  // Filter mappedProviders by lastLogin within startDate/endDate only if a range is selected

  const filteredProviders = isRangeSelected
    ? mappedProviders.data.filter((item: ServiceProviderTableData) =>
        isWithinRange(
          item.lastLogin as string | undefined,
          typeof selectedDates.minDate === 'string' ? selectedDates.minDate : '',
          typeof selectedDates.maxDate === 'string' ? selectedDates.maxDate : '',
        ),
      )
    : mappedProviders.data;

  const filteredMappedProviders = {
    ...mappedProviders,
    data:
      status && status !== 'all'
        ? filteredProviders.filter((item: { kycStatus: string }) => item.kycStatus === status)
        : filteredProviders,
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
          initialMinDate={selectedDates.minDate} // first date input
          initialMaxDate={selectedDates.maxDate} // second date input
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
            onFilterClick={() => setShowFilter(true)} // ✅ Add this line
            ContentStructure={({ item, index }) => (
              <>
                <td>{index + 1 + PAGE_SIZE * (currentPage - 1)}</td>
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
