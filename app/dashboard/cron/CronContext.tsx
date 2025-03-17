'use client';
import {
  CronCampaign,
  CronMaintenance,
  CronNotification,
  CronReward,
  CronServiceActivities,
} from '@/app/lib/mockTypes';
import { createContext, Dispatch, useContext, useEffect, useState } from 'react';

export type TemplateDetailsType<T> = {
  display: boolean;
  type: 'notification' | 'rewards' | 'service-provider' | 'campaign' | 'maintenance' | '';
  data: T | null;
  isEditing: boolean;
};

type TemplateDataType =
  | CronNotification
  | CronReward
  | CronServiceActivities
  | CronCampaign
  | CronMaintenance
  | null;

type CronContextType = {
  templateDetails: TemplateDetailsType<TemplateDataType>;
  setTemplateDetails: Dispatch<TemplateDetailsType<TemplateDataType>>;
};

const CronContext = createContext<CronContextType | undefined>(undefined);

const CronProvider = ({ children }: { children: React.ReactNode }) => {
  const [templateDetails, setTemplateDetails] = useState<TemplateDetailsType<TemplateDataType>>({
    display: false,
    type: '',
    data: null,
    isEditing: true,
  });

  useEffect(() => {
    sessionStorage.setItem('cronData', JSON.stringify(templateDetails.data));
  }, [templateDetails.data]);

  return (
    <CronContext.Provider value={{ templateDetails, setTemplateDetails }}>
      {children}
    </CronContext.Provider>
  );
};

export const useCronContext = () => {
  const context = useContext(CronContext);
  if (!context) {
    throw new Error('useCronContext must be used within CronProvider');
  }
  return context;
};

export default CronProvider;
