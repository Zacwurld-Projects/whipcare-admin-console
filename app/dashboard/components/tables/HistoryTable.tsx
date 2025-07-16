'use client';
// import { useEffect, useState } from 'react';
import FilterForm from './components/FilterForm';
import { convertBookingAndOrderStatus, reflectStatusStyle } from '@/app/lib/accessoryFunctions';
// import BookingDetails from '../modals/BookingDetails';
import { Orders } from '@/app/lib/mockTypes';
import dayjs from 'dayjs';
import { Dispatch } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { fetchServiceProviderOrderById } from '@/app/api/apiClient';
import TablePagination from './components/TablePagination';

const HistoryTable = ({
  tableHeadings,
  heading,
  tableContent,
  currentPage,
  setCurrentPage,
  totalCount,
  contentPerPage,
}: {
  tableHeadings: string[];
  heading: string;
  tableContent: Orders[];
  currentPage: number;
  setCurrentPage: Dispatch<number>;
  totalCount: number;
  contentPerPage: number;
}) => {
  // const [isDisplayingBookingDetails, setIsDisplayingBookingDetails] = useState<boolean>(false);

  // const [orderId, setOrderId] = useState<string | null>(null);

  // const { data: orderDetails, isLoading: isOrderDetailsLoading } = useQuery({
  //   queryKey: [type + 'Details', orderId, userId],
  //   queryFn: () => fetchServiceProviderOrderById(userId, orderId ? orderId : ''),
  //   enabled: !!orderId,
  // });

  // useEffect(() => {
  //   if (!isDisplayingBookingDetails) {
  //     setTimeout(() => setOrderId(null), 200); // delay clearing orderId
  //   }
  // }, [isDisplayingBookingDetails]);

  // const handleOpenOrderDetails = (id: string) => {
  //   setOrderId(id);
  //   setIsDisplayingBookingDetails(true);
  // };

  return (
    <>
      <article className='bg-white dark:bg-dark-secondary'>
        <div className='mb-6 flex items-center justify-between px-6 py-3'>
          <h2 className='text-[30px] font-medium text-gray-800 dark:text-white'>{heading}</h2>
          <FilterForm className='w-[60%]' onSearch={() => {}} onFilterClick={() => {}} search='' />
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
            <tbody className=''>
              {tableContent.length === 0 ? (
                <tr className='h-[300px]'>
                  <td
                    colSpan={tableHeadings.length}
                    className='py-10 text-center text-gray-500 dark:text-white'
                  >
                    You have no orders
                  </td>
                </tr>
              ) : (
                tableContent.map((item, index) => (
                  <tr
                    key={index}
                    className='border-t border-gray-200 dark:border-dark-primary [&_td]:py-6 [&_td]:font-medium [&_td]:text-gray-800 dark:[&_td]:text-white'
                  >
                    <td className='pl-12'>
                      <button
                        className='hover:underline'
                        // onClick={() => handleOpenOrderDetails(item._id)}
                      >
                        {item._id}
                      </button>
                    </td>
                    <td>{dayjs(item.createdAt).format('DD/MM/YY')}</td>
                    <td>
                      {item.carBrand} {item.carModel}
                    </td>
                    {item.location ? <td>{item.location.slice(0, 13)}...</td> : <td></td>}
                    <td>{item.serviceType}</td>
                    {/* {tableHeadings.includes('fee') ? (
                      <td>${item.total}</td>
                    ) : (
                      <td>{item.serviceType}</td>
                    )} */}
                    <td>
                      <button
                        className={`text-medium w-[124px] rounded-[9.37px] text-center font-medium capitalize ${reflectStatusStyle(convertBookingAndOrderStatus(item.status))}`}
                        // onClick={() => handleOpenOrderDetails(item._id)}
                      >
                        {convertBookingAndOrderStatus(item.status)}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          contentPerPage={contentPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={Math.ceil(totalCount / contentPerPage)}
          contentLength={totalCount}
        />
      </article>
      {/* {isDisplayingBookingDetails && (
        <BookingDetails
          type={type}
          booking={orderDetails?.data || null}
          isLoading={isOrderDetailsLoading}
          setIsDisplayingBookingDetails={setIsDisplayingBookingDetails}
        />
      )} */}
    </>
  );
};
export default HistoryTable;
