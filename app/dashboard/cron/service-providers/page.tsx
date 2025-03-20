'use client';

import { fetchCronServiceProviderActivities } from '@/app/api/apiClient';
import DotsIcon from '@/app/dashboard/assets/dotsIcon.svg';
import useCronPageSetup from '../useCronPageSetup';
import SectionLoader from '../../components/Loaders/SectionLoader';
import CronTable from '../CronTable';
import { CronResponse, CronServiceActivities } from '@/app/lib/mockTypes';
import { useCronContext } from '../CronContext';

const ServiceProviderActivitiesPage = () => {
  const { setTemplateDetails } = useCronContext();
  const {
    isInitialLoad,
    currentPage,
    setCurrentPage,
    useFetchPageData: useFetchActivities,
  } = useCronPageSetup(fetchCronServiceProviderActivities);

  if (isInitialLoad) return <SectionLoader height='60vh' />;

  return (
    <>
      <CronTable
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        heading='All Service Provider Activities'
        tableHeadings={[
          'Notification Message',
          'Triggered Condition',
          'Delivery Channel',
          'Target Audience',
          'Frequency',
          '',
        ]}
        tableResponse={useFetchActivities.data as CronResponse<CronServiceActivities>}
        isLoading={useFetchActivities.isLoading}
        ContentStructure={({ item }) => (
          <>
            <td
              className='cursor-pointer hover:underline'
              onClick={() =>
                setTemplateDetails({
                  isEditing: false,
                  data: item,
                  display: true,
                  type: 'service-providers',
                })
              }
            >
              <p className='font-medium text-gray-900 dark:text-white'>{item.notificationType}</p>
              <p>{item.message}</p>
            </td>
            <td>
              {item.onNewBookingCreation && <p>On Booking Creation</p>}
              {item.onBookingUnrespondedOneHour && <p>Unresponded One Hour</p>}
              {item.onPerformanceMetricDrop && <p>On Performance Metric Drop</p>}
            </td>
            <td>
              {typeof item.deliveryChannel === 'string'
                ? item.deliveryChannel
                : item.deliveryChannel?.join(', ')}
            </td>
            <td>{item.targetGroup}</td>
            <td>{item.frequency}</td>
            <td>
              <button className='center-grid size-8 rounded-lg border border-gray-200 dark:border-dark-primary'>
                <DotsIcon className='dark:*:fill-white' />
              </button>
            </td>
          </>
        )}
      />
    </>
  );
};
export default ServiceProviderActivitiesPage;
