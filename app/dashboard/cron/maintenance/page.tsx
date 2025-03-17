'use client';
import DotsIcon from '@/app/dashboard/assets/dotsIcon.svg';
import { fetchCronMaintenance } from '@/app/api/apiClient';
import useCronPageSetup from '../useCronPageSetup';
import SectionLoader from '../../components/Loaders/SectionLoader';
import CronTable from '../CronTable';
import { CronMaintenance, CronResponse } from '@/app/lib/mockTypes';
import dayjs from '@/app/dayjs';
import { useCronContext } from '../CronContext';

const MaintenancePage = () => {
  const { setTemplateDetails } = useCronContext();
  const {
    isInitialLoad,
    currentPage,
    setCurrentPage,
    useFetchPageData: useFetchMaintenance,
  } = useCronPageSetup(fetchCronMaintenance);

  if (isInitialLoad) return <SectionLoader height='60vh' />;

  return (
    <>
      <CronTable
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        heading='All App Maintenance'
        tableHeadings={['Maintenance Date', 'Purpose', 'Post-Update Message', 'Date and Time', '']}
        tableResponse={useFetchMaintenance.data as CronResponse<CronMaintenance>}
        isLoading={useFetchMaintenance.isLoading}
        ContentStructure={({ item }) => (
          <>
            <td
              className='cursor-pointer hover:underline'
              onClick={() =>
                setTemplateDetails({
                  isEditing: false,
                  data: item,
                  display: true,
                  type: 'maintenance',
                })
              }
            >
              {dayjs(item.maintenanceDate).format('MMM DD, YYYY')}
            </td>
            <td>{item.purpose}</td>
            <td>{item.postUpdateMessage}</td>
            <td>{dayjs(item.updatedAt).format('Do MMM, h:mmA')}</td>
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
export default MaintenancePage;
