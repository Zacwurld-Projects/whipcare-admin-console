'use client';

import OpenLinkIcon from '../../assets/openLinkIcon.svg';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import Link from 'next/link';

const PlainTable = ({
  heading,
  content,
  headings,
  link,
}: {
  link: string;
  heading: string;
  content: {
    id: string;
    name: string;
    email: string;
    phone: string;
    serviceType?: string;
    signUp: number;
    lastLogin: number;
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
        <Link href={`/dashboard/${link}`} className='text-small font-medium text-gray-500'>
          View all
        </Link>
      </div>
      <div className='w-full'>
        <table className='w-full'>
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
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                {item.serviceType && <td className='capitalize'>{item.serviceType}</td>}
                <td className='capitalize'>{timeAgo(item.signUp)}</td>
                <td className='capitalize'>{timeAgo(item.lastLogin)}</td>
                {item.status ? (
                  <td>
                    <p
                      className={`text-xsmall rounded-[6px] px-[6px] py-[2px] text-center font-medium capitalize ${reflectStatusStyle(item.status)}`}
                    >
                      {item.status}
                    </p>
                  </td>
                ) : (
                  <td>
                    <Link href={`/dashboard/user-management/${item.id}`}>
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
