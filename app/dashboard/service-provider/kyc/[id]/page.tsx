/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  fetchServiceProviderKpis,
  fetchServiceProviderKyc,
  approveServiceProviderKyc,
  rejectServiceProviderKyc,
} from '@/app/api/apiClient';
import PageLoader from '@/app/dashboard/components/Loaders/PageLoader';
import PageHeading from '@/app/dashboard/components/PageHeading';
import DisplayInfo from '@/app/dashboard/components/profile/DisplayInfo';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { FileImage, ExternalLink } from 'lucide-react';
import KycApprovalModal from '../../../components/modals/KycApprovalModal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import KycRejectionModal from '../../../components/modals/KycRejectionModal';

const KYC = ({ params }: { params: { id: string } }) => {
  const {
    data: kpisData,
    isLoading: isKpisLoading,
    error,
  } = useQuery({
    queryKey: ['serviceProviderKpis'],
    queryFn: () => fetchServiceProviderKpis(params.id),
  });

  const {
    data: kycData,
    isLoading: isKycLoading,
    error: kycError,
  } = useQuery({
    queryKey: ['serviceProviderKyc', params.id],
    queryFn: () => fetchServiceProviderKyc(params.id),
  });

  // Map _id into userContact for KYC
  const mappedKpisData = kpisData
    ? {
        ...kpisData,
        userContact: {
          _id: kpisData._id || params.id,
          firstName: kpisData.userContact?.firstName || kpisData.firstName,
          lastName: kpisData.userContact?.lastName || kpisData.lastName,
          email: kpisData.userContact?.email || kpisData.email,
          nationality: kpisData.userContact?.nationality || kpisData.nationality,
          serviceType: kpisData.userContact?.services || kpisData.services,
          phone: kpisData.userContact?.phone || kpisData.phone,
          image: kpisData.userContact?.image || kpisData.image,
          kycStatus: kpisData.userContact?.status || kpisData.status,
        },
      }
    : null;

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

  if (isKpisLoading || isKycLoading) return <PageLoader />;
  if (error || kycError) return <div>Failed to fetch KYC details</div>;
  if (!mappedKpisData || !mappedKpisData.userContact) return <div>No KYC data found.</div>;

  const kyc = kycData?.data;

  const kycDocs = [
    {
      label: 'Selfie',
      doc: kyc.facePhoto,
    },
    {
      label: 'NIN',
      doc: kyc.nin,
    },
    {
      label: 'Driver License',
      doc: kyc.driversLicense,
    },
    {
      label: "Voters' Card",
      doc: kyc.votersCard,
    },
  ];
  const getFileTypeIcon = (url: string) => {
    if (url.endsWith('.pdf'))
      return <Image src='/icons/pdf-icon.svg' alt='PDF Icon' className='text-[#eb5017]' />;
    return <Image src='/icons/image-icon.svg' alt='Image Icon' className='text-[#eb5017]' />;
  };

  return (
    <div>
      <PageHeading page='Service Provider Profile' pageFilters />
      <div className='mt-4 flex items-center gap-[10px] text-[#27231f] dark:text-dark-tertiary'>
        <Link href={'/dashboard/service-provider/info'} className='text-medium font-medium'>
          Service provider Info
        </Link>
        <p className='text-medium font-medium'>{'>'}</p>
        <p className='heading-h5 font-medium'>
          {mappedKpisData.userContact.firstName} {mappedKpisData.userContact.lastName}
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
                src={mappedKpisData.userContact.image}
                alt='user'
                width={180}
                height={180}
                className='rounded-full'
              />
            </div>
            <div className='flex w-full flex-col gap-2'>
              <DisplayInfo
                title='Full Name'
                value={`${mappedKpisData.userContact.firstName} ${mappedKpisData.userContact.lastName}`}
              />
              <DisplayInfo
                title='Email'
                value={mappedKpisData.userContact.email}
                className='text-medium'
              />
              <DisplayInfo
                title='Nationality'
                value={mappedKpisData.userContact.nationality || 'N/A'}
                className='text-medium'
              />
              <DisplayInfo
                title='Service Type'
                value={mappedKpisData.userContact.serviceType || 'N/A'}
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
              Below are the KYC details for this provider.
            </p>
          </div>
          {kyc ? (
            <div className='mt-6 flex w-full flex-col gap-4'>
              {kycDocs.map(({ label, doc }) => (
                <div
                  key={label}
                  className='flex min-w-[220px] flex-1 flex-col justify-between rounded-lg border border-[#eceae8] bg-[#f9f8f7] px-6 py-4 dark:bg-dark-primary'
                >
                  <div className='mb-2 flex items-center gap-4'>
                    <span className='rounded-full bg-[#f3e7e2] p-2 dark:bg-dark-primary'>
                      {doc?.docUrl ? (
                        getFileTypeIcon(doc.docUrl)
                      ) : (
                        <FileImage className='text-[#eb5017]' />
                      )}
                    </span>
                    <div>
                      <div className='font-medium'>
                        {label}
                        {doc?.docUrl ? `.${doc.docUrl.split('.').pop()}` : ''}
                      </div>
                      <div className='text-xs text-gray-400'>
                        {doc?.createdAt
                          ? `${new Date(doc.createdAt).toLocaleDateString()} • ${new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : ''}
                        {doc?.size ? ` • ${(doc.size / (1024 * 1024)).toFixed(1)}MB` : ''}
                      </div>
                    </div>
                  </div>
                  {doc?.docUrl ? (
                    <button
                      type='button'
                      onClick={() => handleOpenModal(doc.docUrl)}
                      className='mt-2 flex items-center gap-1 font-medium text-[#eb5017]'
                    >
                      <ExternalLink className='h-4 w-4' />
                      View Document
                    </button>
                  ) : (
                    <div className='mt-2 text-xs text-gray-500 dark:text-white'>Not uploaded</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>No KYC details found for this provider.</div>
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
        firstName={mappedKpisData.userContact.firstName}
        lastName={mappedKpisData.userContact.lastName}
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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='relative w-full max-w-2xl rounded-lg bg-white p-4'>
            <button
              onClick={handleCloseModal}
              className='absolute right-2 top-2 text-gray-500 hover:text-black'
            >
              &times;
            </button>
            {modalType === 'image' ? (
              <Image src={modalUrl} alt='Document' className='mx-auto max-h-[70vh]' />
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
