'use client';
import FormButton from '@/app/auth/components/FormButton';
import CenterModalContainer from './CenterModalContainer';
import { UseMutationResult } from '@tanstack/react-query';

const LogoutModal = ({
  exitFunction,
  useLogUserOut,
}: {
  exitFunction: () => void;
  useLogUserOut: UseMutationResult<void, Error, void, unknown>;
}) => {
  return (
    <CenterModalContainer onClick={exitFunction} title='Logging Out'>
      <div className='flex-column w-full items-center gap-8 text-center'>
        <p className='w-[65%] font-medium text-[#413b35]'>Are you sure you want to log out?</p>
        <FormButton
          text='Confirm'
          type='button'
          disabled={useLogUserOut.isPending}
          isLoading={useLogUserOut.isPending}
          onClick={() => useLogUserOut.mutate()}
        />
      </div>
    </CenterModalContainer>
  );
};
export default LogoutModal;
