'use client';

import { CronMaintenance } from '@/app/lib/mockTypes';
import { TemplateDetailsType } from '../CronContext';
import { useState } from 'react';
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
  const [maintenanceData, setMaintenanceData] = useState({
    id: '',
    maintenanceDate: '',
    purpose: '',
    postUpdateMessage: '',
  });

  const [isEditing, setIsEditing] = useState(templateDetails.isEditing);

  const dataPreview = [
    { title: 'Maintenance Date', value: templateDetails.data?.maintenanceDate },
    { title: 'Purpose', value: templateDetails.data?.purpose },
    { title: 'Post Update Message', value: templateDetails.data?.postUpdateMessage },
  ];

  const editMaintenance = () => {
    setIsEditing(true);
    setMaintenanceData({
      id: templateDetails.data?._id || '',
      maintenanceDate: templateDetails.data?.maintenanceDate || '',
      purpose: templateDetails.data?.purpose || '',
      postUpdateMessage: templateDetails.data?.postUpdateMessage || '',
    });
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
          title='Create Maintenance Setting'
          subText='Fill out these details to build your notification'
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
              options={[
                'System Update for New Features',
                'User Interface Improvements',
                'General Maintenance',
              ]}
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
          dataPreview={dataPreview}
          editItem={editMaintenance}
          status={templateDetails.data?.status}
        />
      )}
    </article>
  );
};
export default MaintenanceTemplate;
