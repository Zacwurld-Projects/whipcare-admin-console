'use client';
import { CronCampaign } from '@/app/lib/mockTypes';
import { TemplateDetailsType, useCronContext } from '../CronContext';
import { useState } from 'react';
import HeadingText from './components/HeadingText';
import CronForm from './components/CronForm';
import ItemDetails from './components/ItemDetails';
import SelectOptions from './components/SelectOptions';
import InputFields from './components/InputFields';
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  CreateCampaignPayload,
} from '@/app/api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const CampaignTemplate = ({
  templateDetails,
}: {
  templateDetails: TemplateDetailsType<CronCampaign>;
}) => {
  const queryClient = useQueryClient();
  const { setTemplateDetails } = useCronContext();
  const [campaignData, setCampaignData] = useState<CreateCampaignPayload>({
    title: '',
    campaignName: '',
    inactivityDuration: '',
    message: '',
    deliveryChannel: '',
    status: '',
  });
  const [isEditing, setIsEditing] = useState(templateDetails.isEditing);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasTemplateData = !!(
    templateDetails?.data &&
    (templateDetails.data.campaignName ||
      templateDetails.data.inactivityDuration ||
      templateDetails.data.message ||
      templateDetails.data.deliveryChannel)
  );

  const formHasValues = Object.values(campaignData).some(
    (v) => typeof v === 'string' && v.trim() !== '',
  );

  type PreviewCampaign = {
    title?: string;
    campaignName?: string;
    inactivityDuration?: string;
    message?: string;
    deliveryChannel?: string;
  };

  const previewSource: PreviewCampaign = formHasValues
    ? campaignData
    : hasTemplateData
      ? {
          title: templateDetails.data?.campaignName || '',
          campaignName: templateDetails.data?.campaignName || '',
          inactivityDuration: templateDetails.data?.inactivityDuration || '',
          message: templateDetails.data?.message || '',
          deliveryChannel: Array.isArray(templateDetails.data?.deliveryChannel)
            ? (templateDetails.data?.deliveryChannel as string[])[0] || ''
            : (templateDetails.data?.deliveryChannel as string) || '',
        }
      : campaignData;

  const dataPreview = [
    { title: 'Title', value: previewSource.title || '' },
    { title: 'Campaign Name', value: previewSource.campaignName || '' },
    {
      title: 'Inactivity Threshold',
      value: (previewSource.inactivityDuration as string) || '',
    },
    { title: 'Message', value: (previewSource.message as string) || '' },
    {
      title: 'Delivery Channel',
      value: previewSource.deliveryChannel || '',
    },
  ];

  const editCampaign = () => {
    setIsEditing(true);
    // Hydrate form with whatever is currently shown in preview
    setCampaignData({
      status:
        (previewSource as PreviewCampaign & { status?: string }).status ||
        templateDetails.data?.status ||
        '',
      title: (previewSource.title as string) || (previewSource.campaignName as string) || '',
      campaignName: (previewSource.campaignName as string) || '',
      inactivityDuration: (previewSource.inactivityDuration as string) || '',
      message: (previewSource.message as string) || '',
      deliveryChannel: (previewSource.deliveryChannel as string) || '',
    });
  };

  const handlePublish = async () => {
    const src: PreviewCampaign = previewSource;
    const payload: CreateCampaignPayload = {
      title: (src.title ?? src.campaignName ?? '').toString().trim(),
      campaignName: (src.campaignName ?? '').toString().trim(),
      inactivityDuration: (src.inactivityDuration ?? '').toString().trim(),
      message: (src.message ?? '').toString().trim(),
      deliveryChannel: (src.deliveryChannel ?? '').toString().trim(),
      status: 'Published',
    };
    if (!payload.campaignName || !payload.inactivityDuration || !payload.message) {
      toast.error('Please fill Campaign Name, Inactivity Duration and Message');
      return;
    }
    try {
      setIsPublishing(true);
      if (templateDetails.data?._id) {
        await updateCampaign(templateDetails.data._id, payload);
      } else {
        await createCampaign(payload);
      }
      setIsEditing(false);
      toast.success('Campaign published successfully');
      queryClient.invalidateQueries({ queryKey: ['CronTableData'] });
      setTemplateDetails({ display: false, type: '', data: null, isEditing: true });
    } catch (e) {
      console.error(e);
      toast.error('Failed to publish campaign');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    const src: PreviewCampaign = previewSource;
    const payload: CreateCampaignPayload = {
      title: (src.title ?? src.campaignName ?? '').toString().trim(),
      campaignName: (src.campaignName ?? '').toString().trim(),
      inactivityDuration: (src.inactivityDuration ?? '').toString().trim(),
      message: (src.message ?? '').toString().trim(),
      deliveryChannel: (src.deliveryChannel ?? '').toString().trim(),
      status: 'In Draft',
    };
    try {
      if (templateDetails.data?._id) {
        await updateCampaign(templateDetails.data._id, payload);
      } else {
        await createCampaign(payload);
      }
      setIsEditing(false);
      toast.success('Draft saved');
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
      await deleteCampaign(templateDetails.data._id);
      toast.success('Campaign removed');
      queryClient.invalidateQueries({ queryKey: ['CronTableData'] });
      setTemplateDetails({ display: false, type: '', data: null, isEditing: true });
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete campaign');
    } finally {
      setIsDeleting(false);
    }
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
          title={templateDetails.data ? 'Update Campaign Setting' : 'Create Campaign Setting'}
          subText={
            templateDetails.data
              ? 'Update details for this campaign'
              : 'Fill out these details to build your campaign'
          }
          onSaveDraft={handleSaveDraft}
          onPublish={() => setIsEditing(false)}
        >
          <>
            <InputFields
              title='Title'
              setData={setCampaignData}
              data={campaignData}
              type='text'
              name='title'
              value={campaignData.title}
            />
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
              value={campaignData.inactivityDuration}
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
              value={campaignData.deliveryChannel}
              options={['Push', 'Email', 'In-App', 'All']}
              changeValue={(value) => setCampaignData({ ...campaignData, deliveryChannel: value })}
            />
          </>
        </CronForm>
      ) : (
        <ItemDetails
          dataPreview={dataPreview.map((item) => ({ ...item, value: item.value || undefined }))}
          editItem={editCampaign}
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
export default CampaignTemplate;
