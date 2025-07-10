'use client';

// import Button from '@/app/components/ui/button';
import React, { useState } from 'react';
import { fetchServiceProviderKyc } from '@/app/api/apiClient';
import { toast } from 'sonner';
// import { icons } from '@/lib';
import { useRouter } from 'next/navigation';
import SecurityIcon from '@/app/dashboard/assets/security.svg';
import { ChevronRight } from 'lucide-react';

interface KycVerificationProps {
  serviceProviderId: string;
}

const KycVerification: React.FC<KycVerificationProps> = ({ serviceProviderId }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleVerifyClick = async () => {
    setLoading(true);
    try {
      console.log('Fetching KYC for serviceProviderId:', serviceProviderId);
      const data = await fetchServiceProviderKyc(serviceProviderId);
      console.log('KYC fetch result:', data);
      toast.success('KYC details fetched successfully');
      router.replace(`/dashboard/service-provider/kyc/${serviceProviderId}`);
    } catch (error) {
      console.log('Failed to fetch KYC data');
      toast.error('Failed to fetch KYC details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='z-20 flex w-1/2 border border-[#D42620] py-4 dark:text-white'>
      <div className=''>
        <div className='space-y-3 px-6 pt-5'>
          <h1 className='font-bold'>KYC Information has been submitted</h1>
          <p>
            The service provider kyc document has been <br /> submitted on the app
          </p>
        </div>

        <button
          className={`border-none bg-transparent px-6 py-4 font-semibold text-[#D42620] ${loading ? 'border-none bg-transparent' : ''}`}
          onClick={handleVerifyClick}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify now'}
          <ChevronRight className='ml-2 inline' />
        </button>
      </div>

      <div className='flex translate-x-48 translate-y-4 transform items-end justify-end'>
        <SecurityIcon />
      </div>
    </div>
  );
};

export default KycVerification;
