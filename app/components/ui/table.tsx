import { ComponentLoader } from '@/app/components/loader/ComponentLoader';
import React, { ReactElement } from 'react';

type Props = {
  tableHeaders: ReactElement[];
  tableHeaderStyle?: string;
  tableDataStyle?: string;
  tableRowsData: ReactElement[][];
  rowClickFunction?: () => void;
  isLoading?: boolean;
  /**
   * Message to display when there is no data
   */
  nullDataMessage?: string;
};

const Table = (props: Props) => {
  return (
    <table className=''>
      <tbody>
        <tr className='bg-dark-grey border-dark-grey/10 border-b-[1px]'>
          {props.tableHeaders.map((header, index) => {
            return (
              <th
                key={index}
                className={`bg-light-grey whitespace-nowrap p-3 text-left text-base font-semibold text-primary ${props.tableHeaderStyle}`}
              >
                {header}
              </th>
            );
          })}
        </tr>
        {
          // Show data is loader is not active, and there is data
          !props.isLoading &&
            props.tableRowsData.map((row, index) => {
              return (
                <tr
                  key={index}
                  onClick={props.rowClickFunction ? props.rowClickFunction : () => {}}
                  className={`border-dark-grey/10 border-b-[1px] last:border-b-0 ${props.rowClickFunction ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                >
                  {row.map((data, index) => {
                    return (
                      <td key={index} className={`p-3 text-sm ${props.tableDataStyle}`}>
                        {data}
                      </td>
                    );
                  })}
                </tr>
              );
            })
        }
        {
          // Show loader if loader is active
          props.isLoading && (
            <tr className='bg-dark-grey border-dark-grey/10 border-b-[1px]'>
              <td className='row-span-full bg-white' colSpan={8}>
                <div className='relative grid h-52 place-items-center'>
                  <ComponentLoader className='!h-10 !w-10' />
                </div>
              </td>
            </tr>
          )
        }
        {
          // Show no data message if loader is not active and there is no data
          !props.isLoading && (props.tableRowsData.length === 0 || !props.tableRowsData) && (
            <tr className='bg-dark-grey border-dark-grey/10 border-b-[1px]'>
              <td className='row-span-full bg-white' colSpan={8}>
                <div className='relative grid h-52 place-items-center'>
                  <p className='text-black'>{props.nullDataMessage ?? 'No data available'}</p>
                </div>
              </td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
};

export default Table;
