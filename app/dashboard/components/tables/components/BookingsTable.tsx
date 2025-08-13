'use client';
import { Dispatch, useState, useMemo } from 'react';
import { getOrdersStatusStyles } from '@/app/lib/accessoryFunctions';
import dayjs from 'dayjs';
import { useGlobalContext } from '@/app/context/AppContext';
import { fetchUserBookingsById } from '@/app/api/apiClient';
import { Booking } from '@/app/types/bookings';
import FilterForm from './FilterForm';
import TablePagination from './TablePagination';
import UserBooking from '../../modals/UserBookings';
import SpinLoader from '../../Loaders/SpinLoader';

const BookingsTable = ({
  tableHeadings,
  heading,
  tableContent,
  currentPage,
  setCurrentPage,
  //   totalCount,
  contentPerPage,
  userId,
  onSearch: parentOnSearch,
  search: parentSearch,
  setSearch: parentSetSearch,
  searchInput: parentSearchInput,
}: {
  tableHeadings: string[];
  heading: string;
  tableContent: Booking[];
  currentPage: number;
  setCurrentPage: Dispatch<number>;
  totalCount: number;
  contentPerPage: number;
  userId: string;
  onSearch?: (value: string) => void;
  search?: string;
  setSearch?: (value: string) => void;
  searchInput?: string;
}) => {
  const { setBookDetails, bookDetails, isDark } = useGlobalContext();
  const [, setLoadingId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Local search state if not provided by parent
  const [search, setSearch] = useState('');
  const effectiveSearch = parentSearch !== undefined ? parentSearch : search;
  const effectiveSetSearch = parentSetSearch !== undefined ? parentSetSearch : setSearch;
  const effectiveOnSearch = parentOnSearch !== undefined ? parentOnSearch : effectiveSetSearch;
  const effectiveSearchInput =
    parentSearchInput !== undefined ? parentSearchInput : effectiveSearch;

  const handleSearch = (value: string) => {
    setIsSearching(true);
    effectiveOnSearch(value);
    // Simulate search delay (remove this in production)
    setTimeout(() => setIsSearching(false), 300);
  };

  // Filter bookings based on search term
  const filteredBookings = useMemo(() => {
    if (!effectiveSearch) return tableContent;

    const searchTerm = effectiveSearch.toLowerCase();
    return tableContent.filter((booking) => {
      return (
        booking._id.toLowerCase().includes(searchTerm) ||
        booking.phone.toLowerCase().includes(searchTerm) ||
        (booking.address && booking.address.join(', ').toLowerCase().includes(searchTerm)) ||
        booking.agreedAmount.toString().includes(searchTerm) ||
        booking.status.toLowerCase().includes(searchTerm) ||
        dayjs(booking.date).format('DD/MM/YY').includes(searchTerm) ||
        (booking.serviceType && booking.serviceType.toLowerCase().includes(searchTerm))
      );
    });
  }, [tableContent, effectiveSearch]);

  // Calculate pagination based on filtered results
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * contentPerPage;
    const end = start + contentPerPage;
    return filteredBookings.slice(start, end);
  }, [filteredBookings, currentPage, contentPerPage]);

  // Update total count based on filtered results
  const filteredTotalCount = filteredBookings.length;

  const handleBookingClick = async (bookingId: string) => {
    setBookDetails({
      display: true,
      data: null,
      isLoading: true,
      heading,
    });
    setLoadingId(bookingId);
    try {
      const bookDetails = await fetchUserBookingsById(userId, bookingId);
      setBookDetails({ display: true, data: bookDetails, isLoading: false, heading });
    } catch (e) {
      setBookDetails({ display: true, data: null, isLoading: false, heading });
    }
    setLoadingId(null);
  };

  return (
    <>
      <article className='bg-white dark:bg-dark-secondary'>
        <div className='mb-6 flex items-center justify-between px-6 py-3'>
          <h2 className='text-[30px] font-medium text-gray-800 dark:text-white'>{heading}</h2>
          <FilterForm
            className='w-[60%]'
            onSearch={handleSearch}
            onFilterClick={() => {}}
            search={effectiveSearchInput}
          />
        </div>
        <div className='w-full overflow-auto scrollbar'>
          <table className='w-full min-w-[1100px]'>
            <thead>
              <tr className=''>
                {tableHeadings.map((item, index) => (
                  <th
                    key={item}
                    className={`py-6 text-left font-normal text-gray-500 dark:text-white ${index == 0 ? 'pl-12' : ''}`}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='relative'>
              {isSearching ? (
                <tr className='h-[300px]'>
                  <td colSpan={tableHeadings.length} className='relative'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <SpinLoader size={40} color={isDark ? '#ffffff' : '#27231F'} thickness={2} />
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr className='h-[300px]'>
                  <td
                    colSpan={tableHeadings.length}
                    className='py-10 text-center text-gray-500 dark:text-white'
                  >
                    {effectiveSearch ? 'No matching bookings found' : 'You have no bookings'}
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((item, index) => (
                  <tr
                    key={index}
                    className='cursor-pointer border-t border-gray-200 dark:border-dark-primary [&_td]:py-6 [&_td]:font-medium [&_td]:text-gray-800 dark:[&_td]:text-white'
                    onClick={() => handleBookingClick(item._id)}
                  >
                    <td className='pl-12'>
                      <button className='hover:underline' type='button'>
                        {item._id}
                      </button>
                    </td>
                    <td>{dayjs(item.date).format('DD/MM/YY')}</td>
                    <td>{item.phone}</td>
                    {item.address ? <td>{item.address.join(', ').slice(0, 13)}...</td> : <td></td>}
                    <td>${item.agreedAmount}</td>
                    <td>
                      <button
                        className={`text-medium w-[124px] rounded-[9.37px] text-center font-medium capitalize ${getOrdersStatusStyles(item.status)}`}
                      >
                        {item.status}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isSearching && (
          <TablePagination
            contentPerPage={contentPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(filteredTotalCount / contentPerPage)}
            contentLength={filteredTotalCount}
          />
        )}
      </article>
      {bookDetails.display && <UserBooking />}
    </>
  );
};
export default BookingsTable;
