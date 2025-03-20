'use client';

import {
  CronCampaign,
  CronMaintenance,
  CronNotification,
  CronReward,
  CronServiceActivities,
} from '@/app/lib/mockTypes';
import SidebarModalContainer from '../../components/modals/SidebarModalContainer';
import { TemplateDetailsType, useCronContext } from '../CronContext';
import NotificationTemplate from './NotificationTemplate';
import RewardsTemplate from './RewardsTemplate';
import ServiceProviderTemplate from './ServiceProviderTemplate';
import CampaignTemplate from './CampaignTemplate';
import MaintenanceTemplate from './MaintenanceTemplate';

const TemplateModal = () => {
  const { templateDetails, setTemplateDetails } = useCronContext();

  const closeModal = () => {
    setTemplateDetails({
      display: false,
      type: '',
      data: null,
      isEditing: true,
    });
  };

  return (
    <SidebarModalContainer closeModal={closeModal}>
      {templateDetails.type === 'notification' && (
        <NotificationTemplate
          templateDetails={templateDetails as TemplateDetailsType<CronNotification>}
        />
      )}
      {templateDetails.type === 'rewards' && (
        <RewardsTemplate templateDetails={templateDetails as TemplateDetailsType<CronReward>} />
      )}
      {templateDetails.type === 'service-providers' && (
        <ServiceProviderTemplate
          templateDetails={templateDetails as TemplateDetailsType<CronServiceActivities>}
        />
      )}
      {templateDetails.type === 'campaign' && (
        <CampaignTemplate templateDetails={templateDetails as TemplateDetailsType<CronCampaign>} />
      )}
      {templateDetails.type === 'maintenance' && (
        <MaintenanceTemplate
          templateDetails={templateDetails as TemplateDetailsType<CronMaintenance>}
        />
      )}
    </SidebarModalContainer>
  );
};
export default TemplateModal;
