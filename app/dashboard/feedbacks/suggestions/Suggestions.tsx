'use client';
import { Dispatch, useState } from 'react';
import SectionLoader from '../../components/Loaders/SectionLoader';
import InfoTable from '../../components/tables/InfoTable';
import FallBackUI from '../FallbackUI';
import dayjs from '@/app/dayjs';
import { BaseTableData } from '@/app/lib/mockTypes';
import FormButton from '@/app/auth/components/FormButton';
import SidebarModalContainer from '../../components/modals/SidebarModalContainer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import NumbersOverview from '../../components/NumbersOverview';
import BagIcon from '../../assets/bagIcon.svg';
import AllMatchIcon from '../../assets/allMatchIcon.svg';
import CheckCircleIcon from '../../assets/checkCircleIcon.svg';
import { fetchFeedbackSuggestionsStats, updateFeedbackSuggestion } from '@/app/api/apiClient';

type Suggestion = BaseTableData & {
  suggestion: string;
  status: string;
  date: string;
  anonymous: boolean;
  type: string;
};

const SuggestionModal = ({
  SuggestionData,
  setIsShowingSuggestionsData,
}: {
  SuggestionData: Suggestion | null;
  setIsShowingSuggestionsData: Dispatch<{
    display: boolean;
    data: Suggestion | null;
  }>;
}) => {
  const [, setStatus] = useState(SuggestionData?.status);
  const queryClient = useQueryClient();

  const updateSuggestionMutation = useMutation({
    mutationKey: ['updateSuggestion'],
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateFeedbackSuggestion(id, status), // Adjusted API function
    onSuccess: (data) => {
      toast.success('Marked as reviewed successfully');
      setStatus(data.status);
      setIsShowingSuggestionsData({
        display: false,
        data: null,
      });
      queryClient.invalidateQueries({ queryKey: ['fetchSuggestions'] });
    },
    onError: () => {
      toast.error('There was an issue updating the suggestion. Please try again.');
    },
  });

  if (!SuggestionData) return null;

  const markSuggestionAsReviewed = () => {
    if (SuggestionData._id) {
      updateSuggestionMutation.mutate({ id: SuggestionData._id, status: 'Reviewed' });
    }
  };

  return (
    <SidebarModalContainer
      exitOnOutsideClick
      closeModal={() => {
        setIsShowingSuggestionsData({
          display: false,
          data: null,
        });
      }}
    >
      <article>
        <div className='mb-6 flex items-center gap-4 py-2'>
          <p className='dark:text-white'>Suggestion</p>
          <p
            className={`rounded-[12px] px-3 py-0.5 text-sm ${
              SuggestionData.status === 'Reviewed'
                ? 'bg-[#e7f6ec] text-[#099137]'
                : 'bg-primary-50 text-[#ff915b]'
            }`}
          >
            {SuggestionData.status}
          </p>
        </div>
        <div className='flex-column relative gap-6 p-5'>
          <h4 className='text-lg font-medium dark:text-white'>Suggestion Info</h4>
          <ul className='flex-column gap-4 text-[13px]'>
            <li className='flex items-center justify-between'>
              <p className='text-gray-500 dark:text-dark-tertiary'>Date/Time</p>
              <p className='text-gray-900 dark:text-white'>
                {dayjs(SuggestionData.date).format('DD/MM/YYYY HH:mm A')}
              </p>
            </li>
            <li className='flex items-center justify-between'>
              <p className='text-gray-500 dark:text-dark-tertiary'>User Name</p>
              <p className='text-gray-900 dark:text-white'>
                {SuggestionData.anonymous
                  ? '***'
                  : `${SuggestionData.firstName} ${SuggestionData.lastName}`}
              </p>
            </li>
            <li className='flex items-center justify-between'>
              <p className='text-gray-500 dark:text-dark-tertiary'>Anonymous/Not</p>
              <p className='text-gray-900 dark:text-white'>
                {SuggestionData.anonymous ? 'Anonymous' : 'Not Anonymous'}
              </p>
            </li>
            <li className='flex items-center justify-between'>
              <p className='text-gray-500 dark:text-dark-tertiary'>User Type</p>
              <p className='text-gray-900 dark:text-white'>{SuggestionData.type}</p>
            </li>
          </ul>
          <div>
            <h4 className='mb-5 text-lg font-medium dark:text-white'>Suggestion Description</h4>
            <p className='min-h-[131px] rounded-2xl border border-[#fcd2c2] p-6 text-sm font-medium text-gray-500 dark:border-primary-50 dark:bg-dark-primary dark:text-dark-tertiary'>
              {SuggestionData.suggestion}
            </p>
          </div>
        </div>
        {SuggestionData.status !== 'Reviewed' && (
          <div className='mt-28 w-full'>
            <FormButton
              type='button'
              isLoading={updateSuggestionMutation.isPending}
              onClick={markSuggestionAsReviewed}
              text='Mark as Reviewed'
              className='mx-auto max-w-[380px] dark:bg-dark-accent'
            />
          </div>
        )}
      </article>
    </SidebarModalContainer>
  );
};

const Suggestions = ({
  isInitialLoad,
  suggestionsData,
  isLoading,
  currentPage,
  setCurrentPage,
}: {
  suggestionsData: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    data: Array<Suggestion>;
  };
  isLoading: boolean;
  isInitialLoad: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<number>;
}) => {
  const [isShowingSuggestionsData, setIsShowingSuggestionsData] = useState<{
    display: boolean;
    data: Suggestion | null;
  }>({
    data: null,
    display: false,
  });

  const { data: kpiStats, isLoading: isKpiLoading } = useQuery({
    queryKey: ['fetchSuggestionsStats'],
    queryFn: fetchFeedbackSuggestionsStats,
  });

  if (isInitialLoad && isLoading) return <SectionLoader height='70vh' />;

  if (!suggestionsData || suggestionsData.data.length < 1)
    return <FallBackUI option='suggestions' />;

  const kpiData = [
    {
      icon: BagIcon,
      title: 'Total Suggestions',
      id: 'totalSuggestions',
      count: kpiStats?.data.totalCount || 0,
    },
    {
      icon: CheckCircleIcon,
      title: 'Reviewed Suggestions',
      id: 'reviewedSuggestions',
      count: kpiStats?.data.reviewedCount || 0,
    },
    {
      icon: AllMatchIcon,
      title: 'Pending Suggestions',
      id: 'pendingSuggestions',
      count: kpiStats?.data.pendingCount || 0,
    },
  ];

  return (
    <section className='mt-8'>
      <div className='mb-10'>
        <NumbersOverview stats={kpiData} className='mt-8' isLoading={isKpiLoading} />
      </div>
      <InfoTable
        onFilterClick={() => {}}
        heading='All Suggestions'
        onClickRows={(item) => {
          setIsShowingSuggestionsData({
            display: true,
            data: item,
          });
        }}
        headings={['Name', 'Anonymous/Not', 'User', 'Suggestion', 'Date and Time', 'Status']}
        isLoading={isLoading}
        data={suggestionsData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        ContentStructure={({ item }) => (
          <>
            <td>{item.anonymous ? '***' : `${item.firstName} ${item.lastName}`}</td>
            <td>{item.anonymous ? 'Anonymous' : 'Not Anonymous'}</td>
            <td>{item.type}</td>
            <td className='text-xs'>{item.suggestion}</td>
            <td>
              <p>{dayjs(item.date).format('DD MMM, YYYY')}</p>
              <p className='font-normal text-gray-500 dark:text-white'>
                {dayjs(item.date).format('HH:mm A')}
              </p>
            </td>
            <td>
              <button
                className={`rounded-[12px] px-3 py-0.5 ${
                  item.status === 'Reviewed'
                    ? 'bg-[#e7f6ec] text-[#099137]'
                    : 'bg-primary-50 text-[#ff915b]'
                }`}
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
      {isShowingSuggestionsData.display && (
        <SuggestionModal
          SuggestionData={isShowingSuggestionsData.data}
          setIsShowingSuggestionsData={setIsShowingSuggestionsData}
        />
      )}
    </section>
  );
};

export default Suggestions;
