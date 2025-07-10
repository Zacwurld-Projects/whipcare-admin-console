import { ArrowLeft } from 'lucide-react';
import React, { useEffect } from 'react';

interface KycApprovalModalProps {
  open: boolean;
  onClose: () => void;
  firstName: string;
  lastName: string;
  onConfirm: () => void;
  isLoading: boolean;
  error?: string | null;
}

const KycApprovalModal: React.FC<KycApprovalModalProps> = ({
  open,
  onClose,
  firstName,
  lastName,
  onConfirm,
  isLoading,
  error,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-dark-secondary'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute left-4 top-8 rounded-full border bg-gray-100 p-2 text-2xl font-bold text-gray-400 transition-colors hover:text-black'
          aria-label='Close modal'
        >
          <ArrowLeft className='h-4 w-4' />
        </button>
        <div className='flex flex-col items-center justify-center gap-4 dark:text-white'>
          <h1 className='text-2xl font-semibold text-black dark:text-white'>Verification</h1>
          <p className='text-center text-base font-medium'>
            {firstName} {lastName} will now have <br /> access to the app to get bookings
          </p>
          {error && <div className='text-sm text-red-600'>{error}</div>}
          <button
            onClick={onConfirm}
            className='mt-2 w-full rounded-full bg-[#711E00] px-6 py-3 font-semibold text-white disabled:opacity-60'
            disabled={isLoading}
          >
            {isLoading ? 'Approving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KycApprovalModal;
