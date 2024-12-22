'use client';

import OpenLinkIcon from '../../assets/openLinkIcon.svg';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import Link from 'next/link';

const PlainTable = ({
  page,
  heading,
  content,
  headings,
}: {
  page: string;
  heading: string;
  content: {
    _id: string;
    firstName: string;
    lastName: string;
    image: null | string;
    email: string;
    phone: string | null;
    services?: string[];
    createdAt: string;
    lastLogin: string;
    status?: string;
  }[];
  headings: Array<string>;
}) => {
  const reflectStatusStyle = (status: string) => {
    switch (true) {
      case status === 'deactivated':
        return `bg-[#fbeae9] text-[#dd524d]`;
      case status === 'not verified':
        return `bg-primary-50 text-[#ff915b]`;
      case status === 'verified':
        return `bg-[#e7f6ec] text-[#40b869]`;
      default:
        return '';
    }
  };

  return (
    <article className='w-full rounded-lg border border-[#e0ddd9] bg-white px-6 py-4'>
      <div className='flex items-center justify-between px-[10px] py-4'>
        <h6 className='heading-h6 font-semibold'>{heading}</h6>
        {content.length > 15 && (
          <Link href={`/dashboard/${page}/info`} className='text-small font-medium text-gray-500'>
            View all
          </Link>
        )}
      </div>
      <div className='w-full overflow-x-auto scrollbar'>
        <table className='w-full min-w-[1100px]'>
          <thead>
            <tr>
              {headings.map((item) => (
                <th
                  key={item}
                  className='text-xsmall px-[14px] py-3 text-left font-medium text-gray-500'
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.map((item, index) => (
              <tr
                key={index}
                className='[&_td]:text-xsmall border-y border-y-gray-75 [&_td]:px-[14px] [&_td]:py-3 [&_td]:font-medium [&_td]:text-gray-800'
              >
                <td>{index + 1}</td>
                <td>
                  <Link className='hover:underline' href={`/dashboard/${page}/${item._id}`}>
                    {item.firstName} {item.lastName}
                  </Link>
                </td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                {item.services && <td className='capitalize'>{item.services[0]}</td>}
                <td className='capitalize'>{timeAgo(item.createdAt)}</td>
                <td className='capitalize'>{timeAgo(item.lastLogin)}</td>
                {page === 'service-provider' ? (
                  item.status ? (
                    <td>
                      <Link href={`/dashboard/${page}/${item._id}`}>
                        <p
                          className={`text-xsmall rounded-[6px] px-[6px] py-[2px] text-center font-medium capitalize ${reflectStatusStyle(item.status)}`}
                        >
                          {item.status}
                        </p>
                      </Link>
                    </td>
                  ) : (
                    <td></td>
                  )
                ) : (
                  <td>
                    <Link href={`/dashboard/user-management/${item._id}`}>
                      <OpenLinkIcon />
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};
export default PlainTable;
