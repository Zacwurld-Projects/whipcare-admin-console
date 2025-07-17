/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  // fetchServiceProviderKpis,
  fetchServiceProviderKyc,
  approveServiceProviderKyc,
  rejectServiceProviderKyc,
  fetchServiceProviderProfile,
} from '@/app/api/apiClient';
// import PageLoader from '@/app/dashboard/components/Loaders/PageLoader';
import PageHeading from '@/app/dashboard/components/PageHeading';
import DisplayInfo from '@/app/dashboard/components/profile/DisplayInfo';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import KycApprovalModal from '../../../components/modals/KycApprovalModal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import KycRejectionModal from '../../../components/modals/KycRejectionModal';
// import { ServiceProviderProfile } from '@/app/lib/mockTypes';

const KYC = ({ params }: { params: { id: string } }) => {
  // const {
  //   data: kpisData,
  //   isLoading: isKpisLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ['serviceProviderKpis'],
  //   queryFn: () => fetchServiceProviderKpis(params.id),
  // });

  const {
    data: kycData,
    // isLoading: isKycLoading,
    // error: kycError,
  } = useQuery({
    queryKey: ['serviceProviderKyc', params.id],
    queryFn: () => fetchServiceProviderKyc(params.id),
  });

  //this was used to fetch the profile info for the nationaltity to be displayed

  const { data: profileData } = useQuery({
    queryKey: ['serviceProviderProfile', params.id],
    queryFn: () => fetchServiceProviderProfile(params.id),
  });
  // console.log('fetchServiceProviderProfile response:', profileData);
  const profileInfo = {
    ...(profileData || {}),
    firstName: profileData?.user?.firstName || 'N/A',
    lastName: profileData?.user?.lastName || 'N/A',
    image: profileData?.user?.image || '/images/default-avatar.png',
    email: profileData?.user?.email || 'N/A',
    phone: profileData?.user?.phone || 'N/A',
    // _id: profileData?.user?._id || params.id,
    nationality: profileData?.user?.nationality || 'N/A',
    serviceType: profileData?.user?.serviceType || 'N/A',
  };
  // Map _id into userContact for KYC
  // const mappedKpisData = kpisData
  //   ? {
  //       ...kpisData,
  //       userContact: {
  //         _id: kpisData._id || params.id,
  //         firstName: kpisData.userContact?.firstName || kpisData.firstName,
  //         lastName: kpisData.userContact?.lastName || kpisData.lastName,
  //         email: kpisData.userContact?.email || kpisData.email,
  //         nationality: kpisData.userContact?.nationality || kpisData.nationality,
  //         serviceType: kpisData.userContact?.serviceType || kpisData.serviceType,
  //         phone: kpisData.userContact?.phone || kpisData.phone,
  //         image: kpisData.userContact?.image || kpisData.image,
  //         kycStatus: kpisData.userContact?.status || kpisData.status,
  //         createdAt: kpisData.userContact?.createdAt || kpisData.createdAt,
  //       },
  //     }
  //   : null;

  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'image' | 'pdf' | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [, setIsConfirmed] = useState(false);
  const [, setRejectionReason] = useState('');
  const router = useRouter();

  const handleOpenModal = (url: string) => {
    setModalUrl(url);
    setModalType(url.endsWith('.pdf') ? 'pdf' : 'image');
  };

  const handleCloseModal = () => {
    setModalUrl(null);
    setModalType(null);
  };

  const handleApprove = () => {
    setShowApprovalModal(true);
    setIsConfirmed(false);
    setApproveError(null);
  };
  const handleReject = () => {
    setShowRejectionModal(true);
    setIsConfirmed(false);
    setRejectionError(null);
  };

  const handleConfirmApproval = async () => {
    setIsApproving(true);
    setApproveError(null);
    try {
      await approveServiceProviderKyc(params.id);
      setIsConfirmed(true);
      toast.success('User approved successfully');
      router.replace(`/dashboard/service-provider/${params.id}`);
    } catch (err: any) {
      setApproveError(err?.message || 'Failed to approve user');
      toast.error(err?.message || 'Failed to approve user');
    } finally {
      setIsApproving(false);
    }
  };
  const handleConfirmRejection = async (reason: string) => {
    setIsRejecting(true);
    setRejectionError(null);
    try {
      await rejectServiceProviderKyc(params.id, reason);
      setIsConfirmed(true);
      toast.success('User rejected successfully');
      router.replace(`/dashboard/service-provider/${params.id}`);
    } catch (err: any) {
      setRejectionError(err?.message || 'Failed to reject user');
      toast.error(err?.message || 'Failed to reject user');
    } finally {
      setIsRejecting(false);
    }
  };

  // if (isKpisLoading || isKycLoading) return <PageLoader />;
  // if (error || kycError) return <div>Failed to fetch KYC details</div>;
  // if (!mappedKpisData || !mappedKpisData.userContact) return <div>No KYC data found.</div>;

  const kyc = kycData?.data;

  // Support facePhoto and nin documents from the new response structure
  const kycDocs: Array<{
    label: string;
    url: string;
    status: string;
    createdAt?: string;
    size?: number;
  }> = [];
  if (kyc?.kycDocument?.facePhoto) {
    kycDocs.push({
      label: 'Selfie',
      url: kyc.kycDocument.facePhoto.docUrl,
      status: kyc.kycDocument.facePhoto.status,
      createdAt: kyc.kycDocument.facePhoto.createdAt || kyc.kycDocument.createdAt,
      size: kyc.kycDocument.facePhoto.size,
    });
  }
  if (kyc?.kycDocument?.nin) {
    kycDocs.push({
      label: 'NIN',
      url: kyc.kycDocument.nin.docUrl,
      status: kyc.kycDocument.nin.status,
      createdAt: kyc.kycDocument.nin.createdAt || kyc.kycDocument.createdAt,
      size: kyc.kycDocument.nin.size,
    });
  }
  if (kyc?.kycDocument?.driversLicense) {
    kycDocs.push({
      label: 'Driver License',
      url: kyc.kycDocument.driversLicense.docUrl,
      status: kyc.kycDocument.driversLicense.status,
      createdAt: kyc.kycDocument.driversLicense.createdAt || kyc.kycDocument.createdAt,
      size: kyc.kycDocument.driversLicense.size,
    });
  }

  // function formatDate(dateStr: string) {
  //   const date = new Date(dateStr);
  //   return `${date.toLocaleDateString()} | ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  // }

  // function formatSize(bytes: number) {
  //   return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  // }

  return (
    <div>
      <PageHeading page='Service Provider Profile' pageFilters />
      <div className='mt-4 flex items-center gap-[10px] text-[#27231f] dark:text-dark-tertiary'>
        <Link href={'/dashboard/service-provider/info'} className='text-medium font-medium'>
          Service provider Info
        </Link>
        <p className='text-medium font-medium'>{'>'}</p>
        <p className='heading-h5 font-medium'>
          {profileInfo.firstName} {profileInfo.lastName}
        </p>
      </div>

      <div className='mt-10 border bg-white p-6 dark:border-dark-secondary dark:bg-dark-secondary dark:text-white'>
        <div className='flex w-full justify-between gap-10'>
          <div className='w-2/3'>
            <h1 className='text-xl font-semibold'>User Info</h1>
            <p className='text-sm text-gray-500 dark:text-white'>
              You can edit the information on your profile
            </p>
          </div>

          <div className='mt-10 flex w-full items-start gap-10'>
            <div className='flex items-center gap-2'>
              <Image
                src={profileInfo.image}
                alt='user'
                width={180}
                height={180}
                className='rounded-full'
              />
            </div>
            <div className='flex w-full flex-col gap-2'>
              <DisplayInfo
                title='Full Name'
                value={`${profileInfo.firstName} ${profileInfo.lastName}`}
              />
              <DisplayInfo title='Email' value={profileInfo.email} className='text-medium' />
              <DisplayInfo title='Nationality' value={profileInfo.nationality} />
              <DisplayInfo
                title='Service Type'
                value={profileInfo.serviceType}
                className='text-medium'
              />
            </div>
          </div>
        </div>
        <hr className='mt-20' />

        <div className='mt-10 flex justify-between'>
          <div className='w-2/3'>
            <h1 className='text-xl font-semibold'>KYC Verification</h1>
            <p className='text-sm text-gray-500 dark:text-white'>
              Below is the KYC document for this provider.
            </p>
          </div>
          {/* <h2 className='text-lg font-semibold'>Documents</h2> */}
          {kycDocs.length > 0 ? (
            <div className='flex w-full flex-col gap-4'>
              {kycDocs.map((doc) => (
                <div
                  key={doc.url}
                  className='flex items-center gap-4 rounded-xl bg-[#fff9f7] px-6 py-4'
                >
                  <button
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
              {kyc?.rejectionReason && (
                <div className='mt-2 text-red-600'>Rejection Reason: {kyc.rejectionReason}</div>
              )}
            </div>
          ) : (
            <div>No KYC document found for this provider.</div>
          )}
        </div>
      </div>

      <div className='mt-10 flex items-end justify-end gap-5'>
        <button
          className='rounded-full border border-gray bg-transparent px-14 py-3 font-semibold text-[#983504] dark:text-white'
          onClick={handleReject}
        >
          Reject
        </button>
        <button
          className='rounded-full border border-[#983504] bg-[#983504] px-14 py-3 font-semibold text-white'
          onClick={handleApprove}
        >
          Approve
        </button>
      </div>
      <KycApprovalModal
        open={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        firstName={profileInfo.firstName}
        lastName={profileInfo.lastName}
        onConfirm={handleConfirmApproval}
        isLoading={isApproving}
        error={approveError}
      />
      <KycRejectionModal
        open={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onConfirm={(reason) => {
          setRejectionReason(reason);
          handleConfirmRejection(reason);
        }}
        isLoading={isRejecting}
        error={rejectionError}
      />
      {/* Modal for viewing documents */}

      {modalUrl && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
          onClick={handleCloseModal}
        >
          <div className='relative w-full max-w-2xl rounded-lg bg-black/50 p-4'>
            <button
              onClick={handleCloseModal}
              className='absolute right-2 top-2 text-gray-500 hover:text-black'
            >
              &times;
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
    </div>
  );
};

export default KYC;
