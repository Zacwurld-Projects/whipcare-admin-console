'use client';
import { CronServiceActivities } from '@/app/lib/mockTypes';
import { TemplateDetailsType } from '../CronContext';
import { useState } from 'react';
import HeadingText from './components/HeadingText';
import CronForm from './components/CronForm';
import ItemDetails from './components/ItemDetails';
import SelectOptions from './components/SelectOptions';
import InputFields from './components/InputFields';

const ServiceProviderTemplate = ({
  templateDetails,
}: {
  templateDetails: TemplateDetailsType<CronServiceActivities>;
}) => {
  const [serviceProviderData, setServiceProviderData] = useState<{
    id: string;
    notificationType: string;
    deliveryChannel: string[] | string;
    message: string;
    targetGroup: string;
    frequency: string;
    onNewBookingCreation: boolean;
    onBookingUnrespondedOneHour: boolean;
    onPerformanceMetricDrop: boolean;
  }>({
    id: '',
    notificationType: '',
    deliveryChannel: [],
    message: '',
    targetGroup: '',
    frequency: '',
    onNewBookingCreation: false,
    onBookingUnrespondedOneHour: false,
    onPerformanceMetricDrop: false,
  });
  const [isEditing, setIsEditing] = useState(templateDetails.isEditing);

  const EventTriggers: Array<{
    id: 'onNewBookingCreation' | 'onBookingUnrespondedOneHour' | 'onPerformanceMetricDrop';
    title: string;
  }> = [
    { id: 'onNewBookingCreation', title: 'On Booking Creation' },
    { id: 'onBookingUnrespondedOneHour', title: 'Unresponded One Hour' },
    { id: 'onPerformanceMetricDrop', title: 'On Performance Metric Drops' },
  ];

  const dataPreview = [
    {
      title: 'Notification Type',
      value: templateDetails.data?.notificationType,
    },
    {
      title: 'Delivery Channel',
      value:
        typeof templateDetails.data?.deliveryChannel === 'string'
          ? templateDetails.data?.deliveryChannel
          : templateDetails.data?.deliveryChannel?.join(', '),
    },
    { title: 'Message', value: templateDetails.data?.message },
    {
      title: 'Event-based Triggers',
      value: EventTriggers.map((trigger) =>
        templateDetails.data?.[trigger.id] ? trigger.title : null,
      )
        .filter(Boolean)
        .join(', '),
    },
    { title: 'Target Group', value: templateDetails.data?.targetGroup },
    { title: 'Frequency Option', value: templateDetails.data?.frequency },
  ];

  const editServiceProvider = () => {
    setIsEditing(true);
    setServiceProviderData({
      id: templateDetails.data?._id || '',
      notificationType: templateDetails.data?.notificationType || '',
      deliveryChannel: templateDetails.data?.deliveryChannel || [],
      message: templateDetails.data?.message || '',
      targetGroup: templateDetails.data?.targetGroup || '',
      frequency: templateDetails.data?.frequency || '',
      onNewBookingCreation: templateDetails.data?.onNewBookingCreation || false,
      onBookingUnrespondedOneHour: templateDetails.data?.onBookingUnrespondedOneHour || false,
      onPerformanceMetricDrop: templateDetails.data?.onPerformanceMetricDrop || false,
    });
  };

  return (
    <article>
      <HeadingText
        title='Service Provider Activities'
        isEditing={isEditing}
        status={templateDetails.data?.status}
      />
      {isEditing ? (
        <CronForm
          title='Create Notification Setting'
          subText='Fill out these details to build your notification'
        >
          <>
            <div className='flex w-full items-center gap-[18px] *:w-full'>
              <SelectOptions
                title='Notification Type'
                options={[
                  'New Booking Alert',
                  'Unresponded New Booking Alert',
                  'Performance Warning',
                ]}
                value={serviceProviderData.notificationType}
                changeValue={(value: string) =>
                  setServiceProviderData({ ...serviceProviderData, notificationType: value })
                }
              />
              <SelectOptions
                title='Delivery Channel'
                checkbox
                value={serviceProviderData.deliveryChannel}
                options={['Push', 'Email', 'SMS', 'All']}
                changeCheckedValue={(e, value) => {
                  if (e.target.checked) {
                    setServiceProviderData({
                      ...serviceProviderData,
                      deliveryChannel:
                        value === 'All'
                          ? ['All']
                          : [
                              ...(serviceProviderData.deliveryChannel as string[]).filter(
                                (item) => item !== 'All',
                              ),
                              value,
                            ],
                    });
                  } else {
                    setServiceProviderData({
                      ...serviceProviderData,
                      deliveryChannel: (serviceProviderData.deliveryChannel as string[]).filter(
                        (item) => item !== value,
                      ),
                    });
                  }
                }}
              />
            </div>
            <InputFields
              title='Message'
              name='message'
              value={serviceProviderData.message}
              data={serviceProviderData}
              setData={setServiceProviderData}
              type='textarea'
            />
            <div className='flex-column w-full gap-4'>
              <p className='text-sm font-medium text-[#475367]'>Event-Based Triggers</p>
              {EventTriggers.map((item) => (
                <label
                  key={item.id}
                  htmlFor={item.id}
                  className='flex items-center justify-between'
                >
                  <p className='text-sm font-medium text-gray-500'>{item.title}</p>
                  <input
                    name={item.id}
                    id={item.id}
                    type='checkbox'
                    checked={serviceProviderData[item.id]}
                    onChange={(e) =>
                      setServiceProviderData({
                        ...serviceProviderData,
                        [item.id]: e.target.checked,
                      })
                    }
                    className='peer hidden'
                  />
                  <div className='relative h-[24px] w-[39px] rounded-[27.4px] bg-gray-200 p-[1.5px] peer-checked:bg-[#f56630] peer-checked:*:translate-x-[15.5px]'>
                    <div className='size-[21px] rounded-full border bg-white transition-transform duration-200'></div>
                  </div>
                </label>
              ))}
            </div>
            <SelectOptions
              title='Target Group'
              options={['Active', 'Inactive', 'All service Provider']}
              value={serviceProviderData.targetGroup}
              changeValue={(value: string) =>
                setServiceProviderData({ ...serviceProviderData, targetGroup: value })
              }
            />
            <SelectOptions
              title='Target Audience'
              options={['Immediate', 'Daily', 'Weekly', 'Monthly']}
              value={serviceProviderData.frequency}
              changeValue={(value) =>
                setServiceProviderData({
                  ...serviceProviderData,
                  frequency: value,
                })
              }
            />
          </>
        </CronForm>
      ) : (
        <ItemDetails
          editItem={editServiceProvider}
          dataPreview={dataPreview}
          status={templateDetails.data?.status}
        />
      )}
    </article>
  );
};
export default ServiceProviderTemplate;
