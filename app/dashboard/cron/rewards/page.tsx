'use client';

import { fetchCronRewards } from '@/app/api/apiClient';
import useCronPageSetup from '../useCronPageSetup';
import SectionLoader from '../../components/Loaders/SectionLoader';
import CronTable from '../CronTable';
import dayjs from '@/app/dayjs';
import DotsIcon from '@/app/dashboard/assets/dotsIcon.svg';
import { CronResponse, CronReward } from '@/app/lib/mockTypes';
import { useCronContext } from '../CronContext';

const RewardsPage = () => {
  const { setTemplateDetails } = useCronContext();
  const {
    isInitialLoad,
    currentPage,
    setCurrentPage,
    useFetchPageData: useFetchRewards,
  } = useCronPageSetup(fetchCronRewards);

  if (isInitialLoad) return <SectionLoader height='60vh' />;

  return (
    <>
      <CronTable
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        heading='All Rewards'
        onClickRows={(item) =>
          setTemplateDetails({
            isEditing: false,
            data: item,
            display: true,
            type: 'rewards',
          })
        }
        tableHeadings={[
          'Reward Name',
          'Type',
          'Target Audience',
          'Frequency',
          'Expiary',
          'Last Sent',
          '',
        ]}
        tableResponse={useFetchRewards.data as CronResponse<CronReward>}
        isLoading={useFetchRewards.isLoading}
        ContentStructure={({ item }) => (
          <>
            <td className=''>{item.rewardName}</td>
            <td>{item.rewardType}</td>
            <td>{item.audience}</td>
            <td>{item.frequency}</td>
            <td>{dayjs(item.endDate).diff(dayjs(item.startDate), 'day')} days</td>
            <td>{dayjs(item.endDate).format('Do MMM, h:mmA')}</td>
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
export default RewardsPage;
