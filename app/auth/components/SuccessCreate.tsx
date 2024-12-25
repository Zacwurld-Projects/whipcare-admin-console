'use client';
import FormContainer from './FormContainer';
import SuccessIcon from '../assets/successIcon.svg';
import FormButton from './FormButton';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { doCredentialLogin } from '@/app/actions/authActions';

const SuccessCreate = ({
  credentials,
}: {
  credentials: {
    email: string;
    newPassword: string;
  };
}) => {
  const router = useRouter();

  const useSignUserIn = useMutation({
    mutationKey: ['signUserIn'],
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('password', credentials.newPassword);
      return doCredentialLogin(formData);
    },
    onSuccess: () => {
      toast.success('Login successful!');
      router.push('/dashboard');
    },
    onError: (err) => {
      console.error(err);
      toast.error('There was a problem signing you in.');
      router.push('/auth');
    },
  });

  return (
    <FormContainer>
      <SuccessIcon />
      <h3 className='heading-h3 my-[2px] text-center font-semibold text-gray-800'>
        Congratulations, your account is activated now
      </h3>
      <FormButton
        isLoading={useSignUserIn.isPending}
        disabled={useSignUserIn.isPending}
        type='button'
        text='Go to Dashboard'
        onClick={async () => useSignUserIn.mutate()}
      />
    </FormContainer>
  );
};
export default SuccessCreate;
