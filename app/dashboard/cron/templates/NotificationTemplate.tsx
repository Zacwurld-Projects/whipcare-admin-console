/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  createPushNotification,
  CreatePushNotificationPayload,
  updatePushNotification,
  deletePushNotification,
  createPushNotificationNow,
} from '@/app/api/apiClient';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useCronContext } from '../CronContext';
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
  const queryClient = useQueryClient();
  const { setTemplateDetails } = useCronContext();
  const [notificationData, setNotificationData] = useState({
    id: '',
    subject: '',
    message: '',
    audience: '',
    frequency: '',
  });
  const [isEditing, setIsEditing] = useState(templateDetails.isEditing);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasTemplateData = !!(
    templateDetails?.data &&
    (templateDetails.data.subject ||
      templateDetails.data.message ||
      templateDetails.data.audience ||
      templateDetails.data.frequency)
  );
  const formHasValues = Object.values(notificationData).some(
    (v) => typeof v === 'string' && v.trim() !== '',
  );
  // Prioritize current form values if present (so preview shows latest edits),
  // otherwise fall back to existing template data if available
  const previewSource = formHasValues
    ? (notificationData as any)
    : hasTemplateData
      ? templateDetails.data!
      : (notificationData as any);
  const dataPreview = [
    { title: 'Notification Subject', value: previewSource?.subject },
    { title: 'Message', value: previewSource?.message },
    { title: 'Target Audience', value: previewSource?.audience },
    { title: 'Frequency Option', value: previewSource?.frequency },
  ];

  const EditNotification = () => {
    setIsEditing(true);
    // Hydrate form with whatever is currently shown in preview
    setNotificationData({
      id: (previewSource._id as string) || notificationData.id || '',
      subject: (previewSource.subject as string) || '',
      message: (previewSource.message as string) || '',
      audience: (previewSource.audience as string) || '',
      frequency: (previewSource.frequency as string) || '',
    });
  };

  const mapAudienceToApi = (aud: string) => {
    switch (aud) {
      case 'Car Owner':
        return 'Car Owners';
      case 'Service Provider':
        return 'Service Providers';
      default:
        return aud; // 'All Users' or any backend-accepted string
    }
  };

  const mapFrequencyToApi = (freq: string) => {
    switch (freq) {
      case 'One-Time':
        return 'Once';
      default:
        return freq; // Daily, Weekly, Monthly, Schedule
    }
  };

  const handlePublish = async () => {
    const src: any = previewSource;
    const payload: CreatePushNotificationPayload = {
      subject: (src.subject ?? '').toString().trim(),
      message: (src.message ?? '').toString().trim(),
      audience: mapAudienceToApi(src.audience ?? ''),
      frequency: mapFrequencyToApi(src.frequency ?? ''),
      status: 'Published',
    };
    if (!payload.subject || !payload.message || !payload.audience || !payload.frequency) {
      toast.error('Please fill subject, message, audience and frequency');
      return;
    }
    try {
      setIsPublishing(true);
      if (templateDetails.data?._id) {
        // Updating an existing notification
        await updatePushNotification(templateDetails.data._id, payload);
      } else {
        // Creating a new notification
        if (payload.frequency === 'Once') {
          await createPushNotificationNow(payload);
        } else {
          await createPushNotification(payload);
        }
      }
      setIsEditing(false);
      toast.success('Notification published successfully');
      // refresh table
      queryClient.invalidateQueries({ queryKey: ['CronTableData'] });
      // close modal
      setTemplateDetails({ display: false, type: '', data: null, isEditing: true });
    } catch (e) {
      console.error(e);
      toast.error('Failed to publish notification');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    const src: any = previewSource;
    const payload: CreatePushNotificationPayload = {
      subject: (src.subject ?? '').toString().trim(),
      message: (src.message ?? '').toString().trim(),
      audience: mapAudienceToApi((src.audience ?? 'All Users').toString()),
      frequency: mapFrequencyToApi((src.frequency ?? 'One-Time').toString()),
      status: 'In Draft',
    };
    try {
      if (templateDetails.data?._id) {
        await updatePushNotification(templateDetails.data._id, payload);
      } else {
        await createPushNotification(payload);
      }
      setIsEditing(false);
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
    if (!templateDetails.data?._id) return;
    try {
      setIsDeleting(true);
      await deletePushNotification(templateDetails.data._id);
      toast.success('Notification removed');
      // refresh table
      queryClient.invalidateQueries({ queryKey: ['CronTableData'] });
      setTemplateDetails({ display: false, type: '', data: null, isEditing: true });
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete notification');
    } finally {
      setIsDeleting(false);
    }
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
          onSaveDraft={handleSaveDraft}
          onPublish={() => setIsEditing(false)}
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
export default NotificationTemplate;
