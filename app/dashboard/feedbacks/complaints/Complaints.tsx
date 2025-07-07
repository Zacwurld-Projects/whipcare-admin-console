'use client';
import { Dispatch, useState } from 'react';
import SectionLoader from '../../components/Loaders/SectionLoader';
import InfoTable from '../../components/tables/InfoTable';
import FallBackUI from '../FallbackUI';
import dayjs from '@/app/dayjs';
import { BaseTableData } from '@/app/lib/mockTypes';
import FormButton from '@/app/auth/components/FormButton';
import SidebarModalContainer from '../../components/modals/SidebarModalContainer';
import { useMutation } from '@tanstack/react-query';
import { updateComplaints } from '@/app/api/apiClient';
import { toast } from 'sonner';

type Complaints = BaseTableData & {
  complaint: string;
  source: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const ComplaintModal = ({
  ComplaintData,
  setIsShowingComplaintsData,
}: {
  ComplaintData: Complaints | null;
  setIsShowingComplaintsData: Dispatch<{
    display: boolean;
    data: Complaints | null;
  }>;
}) => {
  const [status, setStatus] = useState(ComplaintData?.status);

  const updateComplaintMutaion = useMutation({
    mutationKey: ['updateComplaint'],
    mutationFn: ({ id, status }: { id: string; status: string }) => updateComplaints(id, status),
    onSuccess: () => {
      toast.success('Marked as reviewed successfully');
      setStatus('Reviewed');
    },
    onError: () => {
      toast.error('There was an issue updating the complaint. Please try again.');
    },
  });

  if (!ComplaintData) return null;
  const markComplaintAsReviewed = () => {
    if (ComplaintData._id) {
      updateComplaintMutaion.mutate({ id: ComplaintData._id, status: 'Reviewed' });
    }
  };

  return (
    <SidebarModalContainer
      exitOnOutsideClick
      closeModal={() => {
        setIsShowingComplaintsData({
          display: false,
          data: null,
        });
      }}
    >
      <article>
        <div className='mb-6 flex items-center gap-4 py-2'>
          <p className='dark:text-white'>Complaint</p>
          <p
            className={`rounded-[12px] px-3 py-0.5 text-sm ${status === 'Reviewed' ? 'bg-[#e7f6ec] text-[#099137]' : 'bg-primary-50 text-[#ff915b]'}`}
          >
            {status}
          </p>
        </div>
        <div className='flex-column relative gap-6 p-5'>
          <h4 className='text-lg font-medium dark:text-white'>Complaint Info</h4>
          <ul className='flex-column gap-4 text-[13px]'>
            <li className='flex items-center justify-between'>
              <p className='text-gray-500 dark:text-dark-tertiary'>Date/Time</p>
              <p className='text-gray-900 dark:text-white'>
                {dayjs(ComplaintData.createdAt).format('DD/MM/YYYY /HH:mm A')}
              </p>
            </li>
            <li className='flex items-center justify-between'>
              <p className='text-gray-500 dark:text-dark-tertiary'>User Name</p>
              <p className='text-gray-900 dark:text-white'>
                {ComplaintData.firstName} {ComplaintData.lastName}
              </p>
            </li>
            <li className='flex items-center justify-between'>
              <p className='text-gray-500 dark:text-dark-tertiary'>Email</p>
              <p className='text-gray-900 dark:text-white'>{ComplaintData.email}</p>
            </li>
            <li className='flex items-center justify-between'>
              <p className='text-gray-500 dark:text-dark-tertiary'>Phone Number</p>
              <p className='text-gray-900 dark:text-white'>{ComplaintData.phone}</p>
            </li>
          </ul>
          <div>
            <h4 className='mb-5 text-lg font-medium dark:text-white'>Complaint Description</h4>
            <p className='min-h-[131px] rounded-2xl border border-[#fcd2c2] p-6 text-sm font-medium text-gray-500 dark:border-primary-50 dark:bg-dark-primary dark:text-dark-tertiary'>
              {ComplaintData.complaint}
            </p>
          </div>
        </div>
        {status !== 'Reviewed' && (
          <div className='mt-28 w-full'>
            <FormButton
              type='button'
              isLoading={updateComplaintMutaion.isPending}
              onClick={markComplaintAsReviewed}
              text=' Mark as Reviewed'
              className='mx-auto max-w-[380px] dark:bg-dark-accent'
            ></FormButton>
          </div>
        )}
      </article>
    </SidebarModalContainer>
  );
};

const Complaints = ({
  isInitialLoad,
  complaintsData,
  isLoading,
  currentPage,
  setCurrentPage,
}: {
  complaintsData: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    data: Array<Complaints>;
  };
  isLoading: boolean;
  isInitialLoad: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<number>;
}) => {
  const [isShowingComplaintsData, setIsShowingComplaintsData] = useState<{
    display: boolean;
    data: Complaints | null;
  }>({
    data: null,
    display: false,
  });

  if (isInitialLoad && isLoading) return <SectionLoader height='70vh' />;

  if (!complaintsData || complaintsData.data.length < 1) return <FallBackUI option='complaints' />;

  return (
    <section className='mt-8'>
      <InfoTable
        heading='All Complaint'
        onClickRows={(item) => {
          setIsShowingComplaintsData({
            display: true,
            data: item,
          });
        }}
        headings={['Name', 'Source', 'Complaints', 'Email/Phone No', 'Date and Time', 'Status']}
        isLoading={isLoading}
        data={complaintsData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        ContentStructure={({ item }) => (
          <>
            <td>
              {item.firstName} {item.lastName}
            </td>
            <td>{item.source === 'ContactUs' ? 'Website' : 'Mobile app'}</td>
            <td className='text-xs'>{item.complaint}</td>
            <td>
              <p>{item.phone}</p>
              <p className='font-normal text-gray-500 dark:text-white'>{item.email}</p>
            </td>
            <td>
              <p>{dayjs(item.createdAt).format('DD MMM, YYYY')}</p>
              <p className='font-normal text-gray-500 dark:text-white'>
                {dayjs(item.createdAt).format('HH:mm A')}
              </p>
            </td>
            <td>
              <button
                className={`rounded-[12px] px-3 py-0.5 ${item.status === 'Reviewed' ? 'bg-[#e7f6ec] text-[#099137]' : 'bg-primary-50 text-[#ff915b]'}`}
              >
                {item.status}
              </button>
            </td>
          </>
        )}
        search={''}
        onSearch={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      {isShowingComplaintsData && (
        <ComplaintModal
          ComplaintData={isShowingComplaintsData.data}
          setIsShowingComplaintsData={setIsShowingComplaintsData}
        />
      )}
    </section>
  );
};
export default Complaints;
