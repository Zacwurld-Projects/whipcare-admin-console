'use client';
import { ChangeEvent, Suspense, useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import InputArea from '../components/InputArea';
import FormButton from '../components/FormButton';
import EnterOtp from '../components/EnterOtp';
import SuccessCreate from '../components/SuccessCreate';
import { useMutation } from '@tanstack/react-query';
import { setMemberCredentials, verifyCreateToken, verifyMemberOtp } from '@/app/api/apiClient';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import SectionLoader from '@/app/dashboard/components/Loaders/SectionLoader';

const CreateUserPageContent = () => {
  const [isVerified, setIsVerified] = useState(false);
  const steps = ['input-userInfo', 'input-otp', 'success'];
  const [currentStep, setCurrentStep] = useState(steps[0]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const createToken = searchParams.get('t');

  const useVerifyToken = useMutation({
    mutationKey: ['verifyToken'],
    mutationFn: async (token: string) => {
      return verifyCreateToken(token);
    },
    onSuccess: (response) => {
      console.log('Token verified:', response);
      setIsVerified(true);
      setUserInfo({ ...userInfo, email: response.email });
    },
    onError: (error) => {
      console.error('Token verification failed:', error);
      toast.error(`Failed to verify token: ${error.message || 'Invalid or expired token'}`);
      setTimeout(() => router.push('/auth'), 2000);
    },
  });

  const useSetMemberCredentials = useMutation({
    mutationKey: ['setMemberCredentials'],
    mutationFn: async () => {
      const { name, newPassword, confirmNewPassword } = userInfo;
      return setMemberCredentials({ name, newPassword, confirmNewPassword }, createToken as string);
    },
    onSuccess: () => {
      toast.success('OTP has been sent to your email');
      setCurrentStep(steps[1]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const useVerifyOTP = useMutation({
    mutationKey: ['verifyOTP'],
    mutationFn: async () => {
      return verifyMemberOtp(otp.join(''), createToken as string);
    },
    onSuccess: () => {
      toast.success('Account created successfully');
      setCurrentStep(steps[2]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (createToken) {
      useVerifyToken.mutate(createToken);
    } else {
      toast.error('No token provided. Please use a valid signup link.');
      setTimeout(() => router.push('/auth'), 2000);
    }
    // Only run on mount and when createToken/router changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createToken, router]);

  if (!isVerified || useVerifyToken.isPending) {
    return (
      <section className='center-grid'>
        <SectionLoader height='fit-content' />
      </section>
    );
  }

  return (
    <section className='center-grid'>
      {currentStep === 'input-userInfo' && (
        <FormContainer>
          <h3 className='heading-h3 font-semibold text-gray-800'>Create an account</h3>
          <form
            className='flex-column w-full gap-8'
            onSubmit={(e) => {
              e.preventDefault();
              useSetMemberCredentials.mutate();
            }}
          >
            <div className='flex-column w-full gap-[18px]'>
              <InputArea
                title='Full name'
                type='text'
                handleChange={handleInputChange}
                name='name'
                value={userInfo.name}
              />
              <InputArea
                title='Email address'
                type='email'
                handleChange={handleInputChange}
                name='email'
                readOnly
                value={userInfo.email}
              />
              <InputArea
                title='Password'
                type='password'
                handleChange={handleInputChange}
                name='newPassword'
                value={userInfo.newPassword}
              />
              <div className='flex-column w-full gap-[8px]'>
                <InputArea
                  type='password'
                  name='confirmNewPassword'
                  title='Confirm Password'
                  handleChange={handleInputChange}
                  value={userInfo.confirmNewPassword}
                />
                <p
                  className={`text-xsmall self-end font-medium text-[#d34124] transition-opacity ${
                    userInfo.confirmNewPassword !== '' &&
                    userInfo.confirmNewPassword !== userInfo.newPassword
                      ? 'opacity-100'
                      : 'opacity-0'
                  }`}
                >
                  Passwords do not match
                </p>
              </div>
            </div>
            <FormButton
              type='submit'
              text='Continue'
              isLoading={useSetMemberCredentials.isPending}
              className='-mt-[4px]'
              disabled={
                !userInfo.name ||
                !userInfo.email ||
                !userInfo.newPassword ||
                !userInfo.confirmNewPassword ||
                useSetMemberCredentials.isPending ||
                userInfo.confirmNewPassword !== userInfo.newPassword
              }
            />
          </form>
        </FormContainer>
      )}
      {currentStep === 'input-otp' && (
        <EnterOtp
          otp={otp}
          isLoading={useVerifyOTP.isPending}
          setOtp={setOtp}
          resendAction={() => useSetMemberCredentials.mutate()}
          action={() => {
            useVerifyOTP.mutate();
          }}
        />
      )}
      {currentStep === 'success' && (
        <SuccessCreate credentials={{ email: userInfo.email, newPassword: userInfo.newPassword }} />
      )}
    </section>
  );
};

const CreateUserPage = () => (
  <Suspense
    fallback={
      <section className='center-grid'>
        <SectionLoader height='fit-content' />
      </section>
    }
  >
    <CreateUserPageContent />
  </Suspense>
);

export default CreateUserPage;
