'use client';
import { fetchPushNotifications } from '@/app/api/apiClient';
import SectionLoader from '../components/Loaders/SectionLoader';
import CronTable from './CronTable';
import dayjs from '@/app/dayjs';
import useCronPageSetup from './useCronPageSetup';
import { CronNotification, CronResponse } from '@/app/lib/mockTypes';
import { useCronContext } from './CronContext';

const reflectNotificationStatusStyle = (status: string) => {
  if (status === 'in draft') return 'text-[#514a4a] bg-[#fbf1f1]';
  if (status === 'published') return 'text-[#099137] bg-[#e7f6ec]';
  return 'text-[#eb5017] bg-[#ffece5]';
};

const CronPage = () => {
  const { setTemplateDetails } = useCronContext();
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
        onClickRows={(item) =>
          setTemplateDetails({
            isEditing: false,
            data: item,
            display: true,
            type: 'notification',
          })
        }
        setCurrentPage={setCurrentPage}
        heading='All Push Notifications'
        tableHeadings={['Titles', 'Target Audience', 'Frequency', 'Date and Time', 'Status']}
        tableResponse={useFetchNotifications.data as CronResponse<CronNotification>}
        isLoading={useFetchNotifications.isLoading}
        ContentStructure={({ item }) => (
          <>
            <td className='max-w-[350px] cursor-pointer flex-col'>
              <p className='text-sm font-medium text-gray-900 dark:text-white'>{item.subject}</p>
              <p className='w-full text-ellipsis text-nowrap'>{item.message}</p>
            </td>
            <td>{item.audience}</td>
            <td>{item.frequency}</td>
            <td>{dayjs(item.updatedAt).format('Do MMM, h:mmA')}</td>
            <td>
              <p
                className={`${reflectNotificationStatusStyle(item.status.toLowerCase())} w-fit rounded-[12px] px-3 py-[2px] text-sm font-medium capitalize`}
              >
                {item.status}
              </p>
            </td>
          </>
        )}
      />
    </>
  );
};

export default CronPage;
