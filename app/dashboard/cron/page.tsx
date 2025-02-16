'use client';
import { fetchPushNotifications } from '@/app/api/apiClient';
import SectionLoader from '../components/Loaders/SectionLoader';
import CronTable from './CronTable';
import dayjs from '@/app/dayjs';
import useCronPageSetup from './useCronPageSetup';
import { CronNotification, CronResponse } from '@/app/lib/mockTypes';

const reflectNotificationStatusStyle = (status: string) => {
  if (status === 'in draft') return 'text-[#514a4a] bg-[#fbf1f1]';
  if (status === 'published') return 'text-[#099137] bg-[#e7f6ec]';
  return 'text-[#eb5017] bg-[#ffece5]';
};

const CronPage = () => {
  const {
    isInitialLoad,
    currentPage,
    setCurrentPage,
    useFetchPageData: useFetchNotifications,
  } = useCronPageSetup(fetchPushNotifications);

  if (isInitialLoad) return <SectionLoader height='60vh' />;

  return (
    <>
      <CronTable
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        heading='All Push Notifications'
        tableHeadings={['Titles', 'Target Audience', 'Frequency', 'Date and Time', 'Status']}
        tableResponse={useFetchNotifications.data as CronResponse<CronNotification>}
        isLoading={useFetchNotifications.isLoading}
        ContentStructure={({ item }) => (
          <>
            <td>
              <div className='max-w-[350px] flex-col'>
                <p className='text-sm font-medium text-gray-900 dark:text-white'>{item.subject}</p>
                <p className='w-full text-ellipsis text-nowrap'>{item.message}</p>
              </div>
            </td>
            <td>{item.audience}</td>
            <td>{item.frequency}</td>
            <td>{dayjs(item.updatedAt).format('Do MMM, h:mmA')}</td>
            <td>
              <button
                className={`${reflectNotificationStatusStyle(item.status.toLowerCase())} rounded-[12px] px-3 py-[2px] text-sm font-medium capitalize`}
              >
                {item.status}
              </button>
            </td>
          </>
        )}
      />
    </>
  );
};

export default CronPage;
