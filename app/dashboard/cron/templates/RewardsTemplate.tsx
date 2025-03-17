'use client';
import { CronReward } from '@/app/lib/mockTypes';
import { TemplateDetailsType } from '../CronContext';
import { useState } from 'react';
import HeadingText from './components/HeadingText';
import CronForm from './components/CronForm';
import ItemDetails from './components/ItemDetails';
import dayjs from 'dayjs';
import InputFields from './components/InputFields';
import SelectOptions from './components/SelectOptions';

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
  const [isEditing, setIsEditing] = useState(templateDetails.isEditing);

  const dataPreview = [
    { title: 'Reward Name', value: templateDetails.data?.rewardName },
    { title: 'Reward Type', value: templateDetails.data?.rewardType },
    { title: 'Message', value: templateDetails.data?.message },
    { title: 'Target Audience', value: templateDetails.data?.audience },
    { title: 'Frequency Option', value: templateDetails.data?.frequency },
    {
      title: 'Expiary Days',
      value: `${dayjs(templateDetails.data?.endDate).diff(dayjs(templateDetails.data?.startDate), 'day')} days`,
    },
    { title: 'Start Date', value: dayjs(templateDetails.data?.startDate).format('DD MMM, YYYY') },
    {
      title: 'End Date',
      value: templateDetails.data?.endDate
        ? dayjs(templateDetails.data?.endDate).format('DD MMM, YYYY')
        : '----',
    },
  ];

  const editReward = () => {
    setIsEditing(true);
    setRewardData({
      id: templateDetails.data?._id || '',
      rewardName: templateDetails.data?.rewardName || '',
      rewardType: templateDetails.data?.rewardType || '',
      audience: templateDetails.data?.audience || '',
      frequency: templateDetails.data?.frequency || '',
      message: templateDetails.data?.message || '',
      startDate: templateDetails.data?.startDate || '',
      endDate: templateDetails.data?.endDate || '',
    });
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
        />
      )}
    </article>
  );
};
export default RewardsTemplate;
