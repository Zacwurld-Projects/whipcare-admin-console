'use client';

import { useState } from 'react';
import { TemplateDetailsType } from '../CronContext';
import SelectOptions from './components/SelectOptions';
import { CronNotification } from '@/app/lib/mockTypes';
import ItemDetails from './components/ItemDetails';
import InputFields from './components/InputFields';
import HeadingText from './components/HeadingText';
import CronForm from './components/CronForm';

const NotificationTemplate = ({
  templateDetails,
}: {
  templateDetails: TemplateDetailsType<CronNotification>;
}) => {
  const [notificationData, setNotificationData] = useState({
    id: '',
    subject: '',
    message: '',
    audience: '',
    frequency: '',
  });
  const [isEditing, setIsEditing] = useState(templateDetails.isEditing);

  const dataPreview = [
    { title: 'Notification Subject', value: templateDetails.data?.subject },
    { title: 'Message', value: templateDetails.data?.message },
    { title: 'Target Audience', value: templateDetails.data?.audience },
    { title: 'Frequency Option', value: templateDetails.data?.frequency },
  ];

  const EditNotification = () => {
    setIsEditing(true);
    setNotificationData({
      id: templateDetails.data?._id || '',
      subject: templateDetails.data?.subject || '',
      message: templateDetails.data?.message || '',
      audience: templateDetails.data?.audience || '',
      frequency: templateDetails.data?.frequency || '',
    });
  };

  return (
    <article>
      <HeadingText
        title='Push Notifications'
        isEditing={isEditing}
        status={templateDetails.data?.status}
      />
      {isEditing ? (
        <CronForm
          title='Create New Push Notification'
          subText='Fill out these details to build your notification'
        >
          <>
            <InputFields
              type='text'
              placeholder='Enter subject'
              title='Notification Subject'
              value={notificationData.subject}
              data={notificationData}
              setData={setNotificationData}
              name='subject'
            />
            <InputFields
              type='textarea'
              title='Message'
              name='message'
              value={notificationData.message}
              data={notificationData}
              setData={setNotificationData}
            />
            <SelectOptions
              options={['Car Owner', 'Service Provider', 'All Users']}
              value={notificationData.audience}
              title='Target Audience'
              changeValue={(value: string) =>
                setNotificationData({ ...notificationData, audience: value })
              }
            />
            <SelectOptions
              options={['One-Time', 'Daily', 'Weekly', 'Monthly', 'Schedule']}
              value={notificationData.frequency}
              title='Frequency Option'
              changeValue={(value: string) =>
                setNotificationData({ ...notificationData, frequency: value })
              }
            />
          </>
        </CronForm>
      ) : (
        <ItemDetails
          dataPreview={dataPreview}
          editItem={EditNotification}
          status={templateDetails.data?.status}
        />
      )}
    </article>
  );
};
export default NotificationTemplate;
