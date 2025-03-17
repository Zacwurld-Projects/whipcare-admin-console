'use client';
import { CronCampaign } from '@/app/lib/mockTypes';
import { TemplateDetailsType } from '../CronContext';
import { useState } from 'react';
import HeadingText from './components/HeadingText';
import CronForm from './components/CronForm';
import ItemDetails from './components/ItemDetails';
import SelectOptions from './components/SelectOptions';
import InputFields from './components/InputFields';

const CampaignTemplate = ({
  templateDetails,
}: {
  templateDetails: TemplateDetailsType<CronCampaign>;
}) => {
  const [campaignData, setCampaignData] = useState<{
    id: string;
    campaignName: string;
    InactivityDuration: string;
    message: string;
    deliveryChannel: string[] | string;
  }>({
    id: '',
    campaignName: '',
    InactivityDuration: '',
    message: '',
    deliveryChannel: [],
  });
  const [isEditing, setIsEditing] = useState(templateDetails.isEditing);

  const dataPreview = [
    {
      title: 'Campaign Name',
      value: templateDetails.data?.campaignName,
    },
    {
      title: 'Inactivity Threshold',
      value: templateDetails.data?.inactivityDuration,
    },
    {
      title: 'Message',
      value: templateDetails.data?.message,
    },
    {
      title: 'Delivery Channel',
      value:
        typeof templateDetails.data?.deliveryChannel === 'string'
          ? templateDetails.data?.deliveryChannel
          : templateDetails.data?.deliveryChannel?.join(', '),
    },
  ];

  const editCampaign = () => {
    setIsEditing(true);
    setCampaignData({
      id: templateDetails.data?._id || '',
      campaignName: templateDetails.data?.campaignName || '',
      InactivityDuration: templateDetails.data?.inactivityDuration || '',
      message: templateDetails.data?.message || '',
      deliveryChannel: templateDetails.data?.deliveryChannel || [],
    });
  };

  return (
    <article>
      <HeadingText
        title='Customer Retargeting'
        isEditing={isEditing}
        status={templateDetails.data?.status}
      />
      {isEditing ? (
        <CronForm
          title='Create Notification Setting'
          subText='Fill out these details to build your notification'
        >
          <>
            <SelectOptions
              title='Campaign Name'
              value={campaignData.campaignName}
              options={[
                '30-Days Inactivity',
                'Car wash Reminder',
                'Mechanic Reminder',
                'Hauling Reminder',
                'Detailing Reminder',
              ]}
              changeValue={(value) => setCampaignData({ ...campaignData, campaignName: value })}
            />
            <InputFields
              title='Inactivity Duration'
              setData={setCampaignData}
              data={campaignData}
              textDesc='Specify the number of days after which the user is considered inactive'
              type='text'
              name='inactivityDuration'
              value={campaignData.InactivityDuration}
            />
            <InputFields
              title='Message'
              setData={setCampaignData}
              data={campaignData}
              type='text'
              name='message'
              value={campaignData.message}
            />
            <SelectOptions
              title='Delivery Channel'
              checkbox
              value={campaignData.deliveryChannel}
              options={['Push', 'Email', 'In-App', 'All']}
              changeCheckedValue={(e, value) => {
                if (e.target.checked) {
                  setCampaignData({
                    ...campaignData,
                    deliveryChannel:
                      value === 'All'
                        ? ['All']
                        : [
                            ...(campaignData.deliveryChannel as string[]).filter(
                              (item) => item !== 'All',
                            ),
                            value,
                          ],
                  });
                } else {
                  setCampaignData({
                    ...campaignData,
                    deliveryChannel: (campaignData.deliveryChannel as string[]).filter(
                      (item) => item !== value,
                    ),
                  });
                }
              }}
            />
          </>
        </CronForm>
      ) : (
        <ItemDetails dataPreview={dataPreview} editItem={editCampaign} />
      )}
    </article>
  );
};
export default CampaignTemplate;
