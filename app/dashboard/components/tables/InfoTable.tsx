'use client';
// import ChevronDownIcon from '../../assets/chevronDown.svg';
import { ComponentType, Dispatch } from 'react';
import TablePagination from './components/TablePagination';
import FilterForm from './components/FilterForm';
import ExportTable from './components/ExportTable';
import SpinLoader from '../Loaders/SpinLoader';
import { BaseTableData } from '@/app/lib/mockTypes';

interface InfoTableProps<T extends BaseTableData> {
  heading: string;
  isLoading?: boolean;
  currentPage: number;
  showItemNumber?: boolean;
  onClickRows?: (item: T) => void;
  setCurrentPage: Dispatch<number>;
  data: {
    data: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  headings: Array<string>;
  ContentStructure?: ComponentType<{ item: T; index: number }>;
}

const DefaultContentStructure = <T extends BaseTableData>({ item }: { item: T }) => (
  <>
    <td>{item._id}</td>
    <td>{item.createdAt}</td>
    <td>{item.lastLogin}</td>
  </>
);
const InfoTable = <T extends BaseTableData>({
  heading,
  isLoading,
  data,
  onClickRows,
  headings,
  showItemNumber,
  currentPage,
  setCurrentPage,
  ContentStructure = DefaultContentStructure,
}: InfoTableProps<T>) => {
  return (
    <article className='w-full rounded-lg border border-[#e0ddd9] bg-white px-6 py-4 dark:border-transparent dark:bg-dark-secondary'>
      <div className='mb-[36px] flex items-center justify-between'>
        <h6 className='heading-h6 font-semibold dark:text-white'>{heading}</h6>
        <div className='flex w-[60%] justify-end gap-6'>
          <FilterForm className='flex-1' />
          <ExportTable />
        </div>
      </div>
      <div className='w-full scrollbar'>
        {isLoading ? (
          <div className='center-grid h-[60vh] w-full'>
            <SpinLoader thickness={2} size={80} color='#983504' />
          </div>
        ) : (
          <table className='w-full'>
            <thead>
              <tr>
                {headings.map((item) => (
                  <th
                    key={item}
                    className='text-xsmall px-[14px] py-3 text-left font-medium text-gray-500 dark:text-white'
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.data.map((item, index) => (
                <tr
                  className={`border-y border-y-gray-75 dark:border-dark-primary [&_:first-child]:rounded-l-lg [&_:last-child]:rounded-r-lg [&_td]:px-[14px] [&_td]:py-3 [&_td]:text-xs [&_td]:font-medium [&_td]:text-gray-800 dark:[&_td]:text-white ${onClickRows ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-primary' : ''}`}
                  key={index}
                  onClick={() => {
                    if (onClickRows) onClickRows(item);
                  }}
                >
                  {showItemNumber && <td>{index + 1 + data.pageSize * (currentPage - 1)}</td>}
                  <ContentStructure index={index} item={item} />
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {data && (
        <TablePagination
          contentPerPage={data.pageSize}
          contentLength={data.totalCount}
          currentPage={currentPage}
          totalPages={Math.ceil(data.totalCount / data.pageSize)}
          setCurrentPage={setCurrentPage}
        />
      )}
    </article>
  );
};
export default InfoTable;
