import { ServiceProviderProfile } from '@/app/lib/mockTypes';
import DisplayInfo from '../../components/profile/DisplayInfo';
// import DisplayAddress from '../../components/profile/DisplayAddress';
import mockServiceImage from '../../assets/mockServiceImage.png';
import LocationIcon from '../../assets/smallLocationIcon.svg';
import NairaIcon from '../../assets/NairaIcon.svg';
import ClockIcon from '../../assets/clockIcon.svg';
import Image from 'next/image';
import dayjs from 'dayjs';
import VerifyIcon from '@/app/dashboard/assets/verify.svg';
import { MapPinIcon } from 'lucide-react';

const Profile = ({
  profileInfo,
  kycStatus,
}: {
  profileInfo: ServiceProviderProfile;
  kycStatus?: string;
}) => {
  const reflectStatusStyle = (status: string) => {
    switch (true) {
      case status === 'Rejected' || 'Deactivated':
        return `bg-[#fbeae9] text-[#dd524d]`;
      case status === 'Pending':
        return `bg-primary-50 text-[#ff915b]`;
      case status === 'Approved' || 'Verified':
        return `bg-[#e7f6ec] text-[#40b869]`;
      default:
        return '';
    }
  };

  const effectiveKycStatus = kycStatus || profileInfo.kycStatus;

  return (
    <article className=''>
      {effectiveKycStatus !== 'Approved' ? (
        <div className='flex min-h-[300px] flex-col items-center justify-center gap-2'>
          <VerifyIcon />
          <h1 className='text-xl dark:text-white'>No info yet</h1>
          <p className='text-base text-gray-500 dark:text-white'>The user has to be verified</p>
        </div>
      ) : (
        <div>
          <div className='flex w-full gap-10'>
            <div className='flex-column w-[53%] gap-4 rounded-lg bg-gray-50 px-5 py-4 dark:bg-dark-primary'>
              <div className='mb-1 flex items-center justify-between'>
                <p className='text-large font-semibold text-gray-800 dark:text-white'>
                  Service Provider Info
                </p>
                {effectiveKycStatus && (
                  <p
                    className={`text-xsmall rounded-[6px] px-[6px] py-[5px] font-medium capitalize ${reflectStatusStyle(effectiveKycStatus)}`}
                  >
                    {effectiveKycStatus}
                  </p>
                )}
              </div>
              <DisplayInfo
                title='Sign up date'
                value={dayjs(profileInfo.signUpDate).format('DD/MM/YY')}
              />
              <DisplayInfo
                title='Last login date'
                value={dayjs(profileInfo.lastLoginDate).format('DD/MM/YY')}
              />
              <DisplayInfo title='Nationality' value={profileInfo.nationality} />
              {profileInfo.NIN && <DisplayInfo title='NIN' value={profileInfo.NIN} />}
              <DisplayInfo title='Language' value={profileInfo.language} />
              <div className='flex-column gap-3'>
                <p className='text-large mb-1 font-semibold text-gray-800'>Address</p>
                {profileInfo.address && (
                  <div className='flex items-center gap-3'>
                    <div className='w-fit rounded-full bg-[#711E00] p-2'>
                      <MapPinIcon color='white' className='' />
                    </div>
                    <p className='text-sm font-medium'>Work Address</p>
                  </div>
                )}
              </div>
            </div>
            <div className='flex-column flex-1 gap-5 rounded-lg bg-gray-50 px-4 py-5 dark:bg-dark-primary'>
              <div className='flex-column gap-4'>
                <p className='text-large mb-1 font-semibold text-gray-800 dark:text-white'>
                  Service Provided
                </p>
                <DisplayInfo
                  title='Type of Service'
                  value={profileInfo.servicesProvided
                    .reduce((acc: string[], item) => {
                      if (!acc.includes(item.serviceType)) {
                        acc.push(item.serviceType);
                      }
                      return acc;
                    }, [])
                    .join(', ')}
                />
                <DisplayInfo
                  title='Preferred Brand'
                  value={profileInfo.servicesProvided
                    .reduce((acc: string[], item) => {
                      if (!acc.includes(item.preferredCarBrand)) {
                        acc.push(item.preferredCarBrand);
                      }
                      return acc;
                    }, [])
                    .join(', ')}
                />
              </div>
              <div>
                <p className='text-large mb-3 flex gap-1 font-semibold text-gray-800 dark:text-white'>
                  <span>List of Services </span>
                  <span className='text-xsmall mt-1 font-medium text-primary-900 dark:text-dark-accent'>
                    ({profileInfo.servicesProvided.length})
                  </span>
                </p>
                <div className='h-[150px] overflow-y-scroll scrollbar'>
                  <ul className='flex-column gap-5'>
                    {profileInfo.servicesProvided.map((item, index) => (
                      <li key={index} className='flex items-start gap-6 px-5'>
                        <Image
                          src={item.images[0] || mockServiceImage}
                          alt={item.serviceType + ' image'}
                          width={105}
                          height={77}
                        />
                        <div className='flex-column gap-2'>
                          <p className='text-xsmall font-medium capitalize text-primary-900 dark:text-dark-accent'>
                            {item.serviceType}
                          </p>
                          <p className='font-medium text-gray-800 dark:text-white'>
                            {item.serviceTitle}
                          </p>
                          <ul className='flex flex-wrap gap-2 [&_li]:flex [&_li]:items-center [&_li]:gap-[1px]'>
                            {item.distance && (
                              <li>
                                <LocationIcon />
                                <p className='text-xsmall font-medium text-gray-400 dark:text-dark-tertiary'>
                                  {item.distance}
                                </p>
                              </li>
                            )}
                            {item.time && (
                              <li>
                                <ClockIcon />
                                <p className='text-xsmall font-medium text-gray-400 dark:text-dark-tertiary'>
                                  {item.time}
                                </p>
                              </li>
                            )}
                            <li className='rounded-lg px-2 py-1 dark:bg-primary-50'>
                              <NairaIcon className='dark:*:fill-dark-accent' />
                              <p className='text-xsmall font-medium text-primary-900 dark:text-dark-accent'>
                                {item.minPrice.toLocaleString('en-US')}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
export default Profile;
