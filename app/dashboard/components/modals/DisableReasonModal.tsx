import CenterModalContainer from './CenterModalContainer';
import Textarea from '@/app/components/ui/textarea';
import Button from '@/app/components/ui/button';
import { useState } from 'react';

interface DisableReasonModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

const DisableReasonModal: React.FC<DisableReasonModalProps> = ({
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [reason, setReason] = useState('');

  return (
    <CenterModalContainer title='Disable Account' onClick={onClose}>
      <div className='flex flex-col gap-4'>
        <p className='text-gray-700 dark:text-gray-300'>
          Please provide a reason for disabling this account.
        </p>
        <Textarea
          placeholder='Reason for disabling account...'
          value={reason}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
          rows={5}
        />
        <div className='mt-4 flex justify-end gap-3'>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(reason)} disabled={isLoading || !reason.trim()}>
            {isLoading ? 'Confirming...' : 'Confirm'}
          </Button>
        </div>
      </div>
    </CenterModalContainer>
  );
};

export default DisableReasonModal;
