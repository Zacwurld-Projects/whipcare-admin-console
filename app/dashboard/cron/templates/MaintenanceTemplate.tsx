'use client';

import { CronMaintenance } from '@/app/lib/mockTypes';
import { TemplateDetailsType } from '../CronContext';
import { useState } from 'react';
import {
  createMaintenance,
  CreateMaintenancePayload,
  updateMaintenance,
  deleteMaintenance,
} from '@/app/api/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCronContext } from '../CronContext';
import HeadingText from './components/HeadingText';
import ItemDetails from './components/ItemDetails';
import CronForm from './components/CronForm';
import InputFields from './components/InputFields';
import SelectOptions from './components/SelectOptions';

const MaintenanceTemplate = ({
  templateDetails,
}: {
  templateDetails: TemplateDetailsType<CronMaintenance>;
}) => {
  const queryClient = useQueryClient();
  const { setTemplateDetails } = useCronContext();
  const [maintenanceData, setMaintenanceData] = useState<CreateMaintenancePayload>({
    maintenanceDate: '',
    purpose: '',
    postUpdateMessage: '',
    status: '',
  });

  const [isEditing, setIsEditing] = useState(templateDetails.isEditing);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasTemplateData = !!(
    templateDetails?.data &&
    (templateDetails.data.maintenanceDate ||
      templateDetails.data.purpose ||
      templateDetails.data.postUpdateMessage)
  );

  const formHasValues = Object.values(maintenanceData).some(
    (v) => typeof v === 'string' && v.trim() !== '',
  );

  // Prioritize current form values if present (so preview shows latest edits),
  // otherwise fall back to existing template data if available
  const previewSource = formHasValues
    ? maintenanceData
    : hasTemplateData
      ? templateDetails.data!
      : maintenanceData;

  const dataPreview = [
    { title: 'Maintenance Date', value: previewSource?.maintenanceDate },
    { title: 'Purpose', value: previewSource?.purpose },
    { title: 'Post Update Message', value: previewSource?.postUpdateMessage },
  ];

  const editMaintenance = () => {
    setIsEditing(true);
    setMaintenanceData({
      status: templateDetails.data?.status || '',
      maintenanceDate: templateDetails.data?.maintenanceDate || '',
      purpose: templateDetails.data?.purpose || '',
      postUpdateMessage: templateDetails.data?.postUpdateMessage || '',
    });
  };

  const handlePublish = async () => {
    const src = previewSource;
    const payload: CreateMaintenancePayload = {
      maintenanceDate: (src.maintenanceDate ?? '').toString().trim(),
      purpose: (src.purpose ?? '').toString().trim(),
      postUpdateMessage: (src.postUpdateMessage ?? '').toString().trim(),
      status: 'Published',
    };

    if (!payload.maintenanceDate || !payload.purpose || !payload.postUpdateMessage) {
      toast.error('Please fill Maintenance Date, Purpose, and Post-update Message');
      return;
    }
    try {
      setIsPublishing(true);
      if (templateDetails.data?._id) {
        await updateMaintenance(templateDetails.data._id, payload);
      } else {
        await createMaintenance(payload);
      }
      setIsEditing(false);
      toast.success('Maintenance published successfully');
      queryClient.invalidateQueries({ queryKey: ['CronTableData'] });
      setTemplateDetails({ display: false, type: '', data: null, isEditing: true });
    } catch (e) {
      console.error(e);
      toast.error('Failed to publish maintenance');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    const src = previewSource;
    const payload: CreateMaintenancePayload = {
      maintenanceDate: (src.maintenanceDate ?? '').toString().trim(),
      purpose: (src.purpose ?? '').toString().trim(),
      postUpdateMessage: (src.postUpdateMessage ?? '').toString().trim(),
      status: 'In Draft',
    };
    try {
      if (templateDetails.data?._id) {
        await updateMaintenance(templateDetails.data._id, payload);
      } else {
        await createMaintenance(payload);
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
      await deleteMaintenance(templateDetails.data._id);
      toast.success('Maintenance removed');
      queryClient.invalidateQueries({ queryKey: ['CronTableData'] });
      setTemplateDetails({ display: false, type: '', data: null, isEditing: true });
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete maintenance');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article>
      <HeadingText
        isEditing={isEditing}
        title='App Maintenance'
        status={templateDetails.data?.status}
      />
      {isEditing ? (
        <CronForm
          title={templateDetails.data ? 'Update Maintenance Setting' : 'Create Maintenance Setting'}
          subText={
            templateDetails.data
              ? 'Update details for this maintenance'
              : 'Fill out these details to build your maintenance'
          }
          onSaveDraft={handleSaveDraft}
          onPublish={() => setIsEditing(false)}
        >
          <>
            <InputFields
              type='date'
              data={maintenanceData}
              setData={setMaintenanceData}
              value={maintenanceData.maintenanceDate}
              title='Maintenance Date'
              name='maintenanceDate'
            />
            <SelectOptions
              title='Purpose'
              value={maintenanceData.purpose}
              options={['System Update', 'User Interface', 'General Maintenance']}
              changeValue={(value) => setMaintenanceData({ ...maintenanceData, purpose: value })}
            />
            <InputFields
              type='textarea'
              title='Post-update Message'
              name='postUpdateMessage'
              value={maintenanceData.postUpdateMessage}
              data={maintenanceData}
              setData={setMaintenanceData}
            />
          </>
        </CronForm>
      ) : (
        <ItemDetails
          dataPreview={dataPreview.map((item) => ({ ...item, value: item.value || undefined }))}
          editItem={editMaintenance}
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
export default MaintenanceTemplate;
