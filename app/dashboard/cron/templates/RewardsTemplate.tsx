/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { CronReward } from '@/app/lib/mockTypes';
import { TemplateDetailsType, useCronContext } from '../CronContext';
import { useState } from 'react';
import HeadingText from './components/HeadingText';
import CronForm from './components/CronForm';
import ItemDetails from './components/ItemDetails';
import dayjs from 'dayjs';
import InputFields from './components/InputFields';
import SelectOptions from './components/SelectOptions';
import { toast } from 'sonner';
import { createReward, updateReward, deleteReward, CreateRewardPayload } from '@/app/api/apiClient';
import { useQueryClient } from '@tanstack/react-query';

const RewardsTemplate = ({
  templateDetails,
}: {
  templateDetails: TemplateDetailsType<CronReward>;
}) => {
  const [rewardData, setRewardData] = useState({
    id: '',
    rewardName: '',
    rewardType: '',
    audience: '',
    frequency: '',
    message: '',
    startDate: '',
    endDate: '',
  });
  const { setTemplateDetails } = useCronContext();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(templateDetails.isEditing);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasTemplateData = !!(
    templateDetails.data &&
    (templateDetails.data.rewardName ||
      templateDetails.data.rewardType ||
      templateDetails.data.message ||
      templateDetails.data.audience ||
      templateDetails.data.frequency ||
      templateDetails.data.startDate)
  );
  const formHasValues = Object.values(rewardData).some(
    (v) => typeof v === 'string' && v.trim() !== '',
  );
  const previewSource: any = formHasValues
    ? rewardData
    : hasTemplateData
      ? templateDetails.data
      : rewardData;
  const dataPreview = [
    { title: 'Reward Name', value: previewSource?.rewardName },
    { title: 'Reward Type', value: previewSource?.rewardType },
    { title: 'Message', value: previewSource?.message },
    { title: 'Target Audience', value: previewSource?.audience },
    { title: 'Frequency Option', value: previewSource?.frequency },
    {
      title: 'Expiary Days',
      value:
        previewSource?.endDate && previewSource?.startDate
          ? `${dayjs(previewSource.endDate).diff(dayjs(previewSource.startDate), 'day')} days`
          : '—',
    },
    {
      title: 'Start Date',
      value: previewSource?.startDate ? dayjs(previewSource.startDate).format('DD MMM, YYYY') : '—',
    },
    {
      title: 'End Date',
      value: previewSource?.endDate ? dayjs(previewSource.endDate).format('DD MMM, YYYY') : '—',
    },
  ];

  const editReward = () => {
    setIsEditing(true);
    // Hydrate form with whatever is currently shown in preview
    setRewardData({
      id: (previewSource._id as string) || rewardData.id || '',
      rewardName: (previewSource.rewardName as string) || '',
      rewardType: (previewSource.rewardType as string) || '',
      audience: (previewSource.audience as string) || '',
      frequency: (previewSource.frequency as string) || '',
      message: (previewSource.message as string) || '',
      startDate: (previewSource.startDate as string) || '',
      endDate: (previewSource.endDate as string) || '',
    });
  };

  const mapAudienceToApi = (aud: string) => {
    switch (aud) {
      case 'Car Owner':
        return 'Car Owners';
      case 'Service Provider':
        return 'Service Providers';
      default:
        return aud;
    }
  };
  const mapFrequencyToApi = (freq: string) => {
    switch (freq) {
      case 'One-Time':
        return 'Once';
      default:
        return freq;
    }
  };

  const handlePublish = async () => {
    const src = previewSource;
    const payload: CreateRewardPayload = {
      rewardName: (src.rewardName ?? '').toString().trim(),
      rewardType: (src.rewardType ?? '').toString().trim(),
      audience: mapAudienceToApi((src.audience ?? '').toString()),
      message: (src.message ?? '').toString().trim(),
      frequency: mapFrequencyToApi((src.frequency ?? '').toString()),
      startDate: (src.startDate ?? '').toString(),
      endDate: (src.endDate ?? '').toString(),
      status: 'Published',
    };
    if (!payload.rewardName || !payload.rewardType || !payload.audience || !payload.frequency) {
      toast.error('Please fill reward name, type, audience and frequency');
      return;
    }
    try {
      setIsPublishing(true);
      if ((templateDetails.data as any)?._id) {
        await updateReward((templateDetails.data as any)._id as string, payload);
      } else {
        await createReward(payload);
      }
      toast.success('Reward published successfully');
      // refresh table
      queryClient.invalidateQueries({ queryKey: ['CronTableData'] });
      setTemplateDetails({ display: false, type: '', data: null, isEditing: true });
    } catch (e) {
      console.error(e);
      toast.error('Failed to publish reward');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    const src = previewSource;
    const payload: CreateRewardPayload = {
      rewardName: (src.rewardName ?? '').toString().trim(),
      rewardType: (src.rewardType ?? '').toString().trim(),
      audience: mapAudienceToApi((src.audience ?? 'All Users').toString()),
      message: (src.message ?? '').toString().trim(),
      frequency: mapFrequencyToApi((src.frequency ?? 'One-Time').toString()),
      startDate: (src.startDate ?? '').toString(),
      endDate: (src.endDate ?? '').toString(),
      status: 'In Draft',
    };
    try {
      if ((templateDetails.data as any)?._id) {
        await updateReward((templateDetails.data as any)._id as string, payload);
      } else {
        await createReward(payload);
      }
      toast.success('Draft saved');
      // refresh table
      queryClient.invalidateQueries({ queryKey: ['CronTableData'] });
      setTemplateDetails({ display: false, type: '', data: null, isEditing: true });
    } catch (e) {
      console.error(e);
      toast.error('Failed to save draft');
    }
  };

  const handleDelete = async () => {
    if (!(templateDetails.data as any)?._id) return;
    try {
      setIsDeleting(true);
      await deleteReward((templateDetails.data as any)._id as string);
      toast.success('Reward removed');
      // refresh table
      queryClient.invalidateQueries({ queryKey: ['CronTableData'] });
      setTemplateDetails({ display: false, type: '', data: null, isEditing: true });
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete reward');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article>
      <HeadingText
        title='Rewards Centre'
        isEditing={isEditing}
        status={templateDetails.data?.status}
      />
      {isEditing ? (
        <CronForm
          title='Create Reward Setting'
          subText='Fill out these details to build your notification'
          onSaveDraft={handleSaveDraft}
          onPublish={() => setIsEditing(false)}
        >
          <>
            <div className='flex w-full items-center gap-[18px] *:w-full'>
              <InputFields
                title='Reward Name'
                data={rewardData}
                setData={setRewardData}
                value={rewardData.rewardName}
                type='text'
                name='rewardName'
              />
              <SelectOptions
                options={[
                  'Discount Coupon',
                  'Milestone Discount',
                  'Seasonal Discount',
                  'Referral Bonus',
                ]}
                title='Reward Type'
                value={rewardData.rewardType}
                changeValue={(value: string) =>
                  setRewardData({
                    ...rewardData,
                    rewardType: value,
                  })
                }
              />
            </div>
            <SelectOptions
              options={['Car Owner', 'Service Provider', 'All Users']}
              value={rewardData.audience}
              title='Target Audience'
              changeValue={(value: string) => setRewardData({ ...rewardData, audience: value })}
            />
            <InputFields
              type='textarea'
              title='Message'
              name='message'
              value={rewardData.message}
              data={rewardData}
              setData={setRewardData}
            />
            <SelectOptions
              options={['One-Time', 'Daily', 'Weekly', 'Monthly', 'Schedule']}
              value={rewardData.frequency}
              title='Frequency Option'
              changeValue={(value: string) => setRewardData({ ...rewardData, frequency: value })}
            />
            <div className='flex w-full items-center gap-[18px] *:w-full'>
              <InputFields
                title='Start Date'
                data={rewardData}
                setData={setRewardData}
                value={rewardData.startDate}
                type='date'
                name='startDate'
              />
              <InputFields
                title='End Date'
                data={rewardData}
                setData={setRewardData}
                value={rewardData.endDate}
                type='date'
                name='endDate'
              />
            </div>
          </>
        </CronForm>
      ) : (
        <ItemDetails
          status={templateDetails.data?.status}
          editItem={editReward}
          dataPreview={dataPreview}
          onPublish={handlePublish}
          isPublishing={isPublishing}
          onDelete={handleDelete}
          isDeleting={isDeleting}
          showPublishAction={formHasValues || templateDetails.data?.status !== 'Published'}
        />
      )}
    </article>
  );
};
export default RewardsTemplate;
