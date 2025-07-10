import { ArrowLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface KycRejectionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (rejectionReason: string) => void;
  isLoading: boolean;
  error?: string | null;
}

const REJECTION_REASONS = [
  'Incomplete documents',
  'Invalid ID',
  'Photo not clear',
  'Information mismatch',
  'Other',
];

const KycRejectionModal: React.FC<KycRejectionModalProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  error,
}) => {
  const [reason, setReason] = useState('');

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
        <div className='flex flex-col'>
          <h1 className='text-center text-2xl font-bold text-black dark:text-white'>
            Verification Rejection
          </h1>
          <div className='mt-10'>
            <p className='mb-1 text-start text-base text-gray-700 dark:text-white'>Reason</p>
            <select
              className='mb-2 w-full rounded-lg border border-gray-300 p-3 text-base focus:border-[#711E00] focus:outline-none dark:bg-dark-primary dark:text-white'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
            >
              <option value='' disabled className='text-gray-400'>
                Input reason for rejection
              </option>
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          {error && <div className='mb-2 text-sm text-[#711E00]'>{error}</div>}
          <div className='mt-2 flex w-full justify-end gap-3'>
            <button
              onClick={() => onConfirm(reason)}
              className='w-full rounded-full bg-[#711E00] px-6 py-4 font-semibold text-white transition-colors hover:bg-[#39190ed1] disabled:opacity-60'
              disabled={isLoading || !reason}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycRejectionModal;
