// components/profile/Profile.tsx
import DisplayInfo from '../../components/profile/DisplayInfo';
import mockServiceImage from '../../assets/mockServiceImage.png';
import LocationIcon from '../../assets/smallLocationIcon.svg';
import NairaIcon from '../../assets/NairaIcon.svg';
import ClockIcon from '../../assets/clockIcon.svg';
import Image from 'next/image';
import dayjs from 'dayjs';
import VerifyIcon from '@/app/dashboard/assets/verify.svg';
import { MapPinIcon, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchServiceProviderKyc } from '@/app/api/apiClient';
import { ServiceProviderProfile } from '@/app/lib/mockTypes';

type Address = {
  id?: string;
  address: string;
  type?: string;
  landmark?: string;
  longitude?: number;
  latitude?: number;
};

const Profile = ({
  profileInfo,
  kycStatus,
  providerId,
}: {
  profileInfo: ServiceProviderProfile;
  kycStatus?: string;
  providerId: string;
}) => {
  const { data: kycData } = useQuery({
    queryKey: ['kycDetails', providerId],
    queryFn: () => fetchServiceProviderKyc(providerId),
  });

  const ninId = kycData?.data?.kycDocument?.nin?.docId;
  const driversLicenseId = kycData?.data?.kycDocument?.driversLicense?.docId;

  // KYC Docs Normalization
  const kycDocumentObj = kycData?.data?.kycDocument || {};
  const kycDocs: Array<{
    label: string;
    url: string;
    status: string;
    createdAt?: string;
    size?: number;
    type?: string;
  }> = [];
  if (kycDocumentObj.facePhoto) {
    kycDocs.push({
      label: 'Selfie',
      url: kycDocumentObj.facePhoto.docUrl,
      status: kycDocumentObj.facePhoto.status,
      createdAt: kycDocumentObj.facePhoto.createdAt || kycDocumentObj.createdAt,
      size: kycDocumentObj.facePhoto.size,
      type: kycDocumentObj.facePhoto.docUrl?.endsWith('.pdf') ? 'pdf' : 'image',
    });
  }
  if (kycDocumentObj.nin) {
    kycDocs.push({
      label: 'NIN',
      url: kycDocumentObj.nin.docUrl,
      status: kycDocumentObj.nin.status,
      createdAt: kycDocumentObj.nin.createdAt || kycDocumentObj.createdAt,
      size: kycDocumentObj.nin.size,
      type: kycDocumentObj.nin.docUrl?.endsWith('.pdf') ? 'pdf' : 'image',
    });
  }
  if (kycDocumentObj.driversLicense) {
    kycDocs.push({
      label: 'Driver License',
      url: kycDocumentObj.driversLicense.docUrl,
      status: kycDocumentObj.driversLicense.status,
      createdAt: kycDocumentObj.driversLicense.createdAt || kycDocumentObj.createdAt,
      size: kycDocumentObj.driversLicense.size,
      type: kycDocumentObj.driversLicense.docUrl?.endsWith('.pdf') ? 'pdf' : 'image',
    });
  }

  // Modal State
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'image' | 'pdf' | null>(null);
  const handleOpenModal = (url: string) => {
    setModalUrl(url);
    setModalType(url.endsWith('.pdf') ? 'pdf' : 'image');
  };
  const handleCloseModal = () => {
    setModalUrl(null);
    setModalType(null);
  };

  const reflectStatusStyle = (status: string) => {
    switch (true) {
      case status === 'Rejected' || status === 'Deactivated':
        return `bg-[#fbeae9] text-[#dd524d]`;
      case status === 'Pending':
        return `bg-primary-50 text-[#ff915b]`;
      case status === 'Approved' || status === 'Verified':
        return `bg-[#e7f6ec] text-[#40b869]`;
      case status === 'Disabled':
        return `bg-gray-200 text-gray-700`;
      default:
        return '';
    }
  };

  const isUserDisabled = profileInfo.user.disabled?.disabledUntil != null;
  const effectiveKycStatus = isUserDisabled ? 'Disabled' : kycStatus || profileInfo.user.kycStatus;

  return (
    <article className=''>
      {isUserDisabled ? (
        <div className='mb-4 flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 px-5 py-4 dark:bg-dark-primary'>
          <h1 className='text-xl dark:text-white'>User Account Disabled</h1>
          <p className='text-base text-gray-500 dark:text-white'>
            Reason: {profileInfo.user.disabled?.reason || 'N/A'}
          </p>
          <p className='text-base text-gray-500 dark:text-white'>
            Disabled Until:{' '}
            {profileInfo.user.disabled?.disabledUntil
              ? dayjs(profileInfo.user.disabled.disabledUntil).format('MMM DD, YYYY')
              : 'N/A'}
          </p>
        </div>
      ) : null}

      {profileInfo.user.kycStatus === 'Approved' || isUserDisabled ? (
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
              <DisplayInfo title='Nationality' value={profileInfo.user.nationality} />
              {profileInfo.NIN && <DisplayInfo title='NIN' value={profileInfo.NIN} />}
              <DisplayInfo title='Language' value={profileInfo.user.language} />
              {ninId && <DisplayInfo title='NIN ID' value={ninId} />}
              {driversLicenseId && (
                <DisplayInfo title='Driver License ID' value={driversLicenseId} />
              )}

              {kycDocs.length > 0 ? (
                <div className='flex w-full flex-col gap-4'>
                  {kycDocs.map((doc) => (
                    <div
                      key={doc.url}
                      className='flex items-center gap-4 rounded-xl bg-[#fff9f7] px-6 py-4'
                    >
                      <button
                        type='button'
                        onClick={() => handleOpenModal(doc.url)}
                        className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100'
                      >
                        <ExternalLink className='h-5 w-5 text-gray-500' />
                      </button>
                      <div className='flex flex-col'>
                        <span className='text-base font-semibold text-gray-900'>
                          {doc.label || doc.url.split('/').pop()}
                        </span>
                        <span className='mt-1 flex gap-2 text-xs text-gray-500'>
                          {doc.createdAt
                            ? `${new Date(doc.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })} 
                               ${new Date(doc.createdAt).toLocaleTimeString([], {
                                 hour: '2-digit',
                                 minute: '2-digit',
                                 hour12: true,
                               })}`
                            : ``}
                          {doc.size && (
                            <>
                              <span>•</span>
                              <span>{(doc.size / (1024 * 1024)).toFixed(0)}MB</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className='flex-column gap-3'>
                    <p className='text-large mb-1 font-semibold text-gray-800 dark:text-white'>
                      Address
                    </p>
                    {Array.isArray(profileInfo.user.address) &&
                    profileInfo.user.address.length > 0 ? (
                      <ul className='flex flex-col gap-5'>
                        {(profileInfo.user.address as Address[]).map((addr, idx) => (
                          <li key={addr.id || idx} className='flex items-center gap-3'>
                            <div className='w-fit rounded-full bg-[#711E00] p-2'>
                              <MapPinIcon color='white' className='' />
                            </div>
                            <div className='text-gray-800 dark:text-white'>
                              <p className='text-sm font-semibold capitalize dark:text-white'>
                                {addr.type} Address
                              </p>
                              <p className='text-sm font-medium capitalize'>{addr.address}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-sm text-gray-500'>No address available.</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className='text-sm text-gray-500'>No KYC documents available.</p>
              )}
            </div>
            <div className='flex-column h-[40rem] flex-1 gap-5 rounded-lg bg-gray-50 px-4 py-5 dark:bg-dark-primary'>
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
                  value={
                    profileInfo.servicesProvided.reduce((acc: string[], item) => {
                      if (item.preferredCarBrand && !acc.includes(item.preferredCarBrand)) {
                        acc.push(item.preferredCarBrand);
                      }
                      return acc;
                    }, []).length === 1
                      ? profileInfo.servicesProvided.reduce((acc: string[], item) => {
                          if (item.preferredCarBrand && !acc.includes(item.preferredCarBrand)) {
                            acc.push(item.preferredCarBrand);
                          }
                          return acc;
                        }, [])[0]
                      : profileInfo.servicesProvided
                          .reduce((acc: string[], item) => {
                            if (item.preferredCarBrand && !acc.includes(item.preferredCarBrand)) {
                              acc.push(item.preferredCarBrand);
                            }
                            return acc;
                          }, [])
                          .join(', ')
                  }
                />
              </div>
              <div>
                <p className='text-large mb-3 flex gap-1 font-semibold text-gray-800 dark:text-white'>
                  <span>List of Services </span>
                  <span className='text-xsmall mt-1 font-medium text-primary-900 dark:text-dark-accent'>
                    ({profileInfo.servicesProvided.length})
                  </span>
                </p>
                <div className='h-[300px] overflow-y-scroll scrollbar'>
                  <ul className='flex-column gap-5'>
                    {profileInfo.servicesProvided.map(
                      (item: ServiceProviderProfile['servicesProvided'][number]) => (
                        <li key={item._id} className='flex items-start gap-6 px-5'>
                          <Image
                            src={item.images[0] || mockServiceImage}
                            alt={item.serviceType + ' image'}
                            width={80}
                            height={80}
                            className='h-40 w-40'
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
                                  {item.minPrice.toLocaleString('en-US')} -{' '}
                                  {item.maxPrice.toLocaleString('en-US')}
                                </p>
                              </li>
                            </ul>
                          </div>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex min-h-[300px] flex-col items-center justify-center gap-2'>
          <VerifyIcon />
          <h1 className='text-xl dark:text-white'>No info yet</h1>
          <p className='text-base text-gray-500 dark:text-white'>The user has to be verified</p>
        </div>
      )}

      {modalUrl && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
          onClick={handleCloseModal}
        >
          <div
            className='relative w-full max-w-2xl rounded-lg bg-black/50 p-4'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className='absolute right-2 top-2 text-gray-500 hover:text-black'
            >
              ×
            </button>
            {modalType === 'image' ? (
              <Image
                src={modalUrl}
                alt='Document'
                width={500}
                height={500}
                className='mx-auto max-h-[100vh]'
              />
            ) : (
              <iframe src={modalUrl} title='PDF Document' className='h-[70vh] w-full' />
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default Profile;
