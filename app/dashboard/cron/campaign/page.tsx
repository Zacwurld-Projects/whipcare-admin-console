'use client';
import DotsIcon from '@/app/dashboard/assets/dotsIcon.svg';
import { fetchCronCampaigns } from '@/app/api/apiClient';
import useCronPageSetup from '../useCronPageSetup';
import SectionLoader from '../../components/Loaders/SectionLoader';
import CronTable from '../CronTable';
import { CronCampaign, CronResponse } from '@/app/lib/mockTypes';
import dayjs from '@/app/dayjs';
import { useCronContext } from '../CronContext';

const CustomerRetargeting = () => {
  const { setTemplateDetails } = useCronContext();
  const {
    isInitialLoad,
    currentPage,
    setCurrentPage,
    useFetchPageData: useFetchCampaigns,
  } = useCronPageSetup(fetchCronCampaigns);

  if (isInitialLoad) return <SectionLoader height='60vh' />;

  return (
    <>
      <CronTable
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onClickRows={(item) =>
          setTemplateDetails({
            isEditing: false,
            data: item,
            display: true,
            type: 'campaign',
          })
        }
        heading='All Campaigns'
        tableHeadings={[
          'Campaign Name',
          'Inactivity Threshold',
          'Message Template',
          'Delivery Channel',
          'Date Created',
          '',
        ]}
        tableResponse={useFetchCampaigns.data as CronResponse<CronCampaign>}
        isLoading={useFetchCampaigns.isLoading}
        ContentStructure={({ item }) => (
          <>
            <td>{item.campaignName}</td>
            <td>{item.inactivityDuration}</td>
            <td>{item.message}</td>
            <td>
              {typeof item.deliveryChannel === 'string'
                ? item.deliveryChannel
                : item.deliveryChannel?.join(', ')}
            </td>
            <td>{dayjs(item.createdAt).format('Do MMM, h:mmA')}</td>
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
export default CustomerRetargeting;
