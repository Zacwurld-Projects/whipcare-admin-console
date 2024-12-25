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
import SpinLoader from '@/app/dashboard/components/SpinLoader';
import { toast } from 'sonner';

const CreateUserPageContent = () => {
  const [isverified, setIsVerified] = useState(false);
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
      // console.log(response);
      setIsVerified(true);
      setUserInfo({ ...userInfo, email: response.email });
    },
    onError: () => {
      router.push('/auth');
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
      toast.success('OTP has been sent to your email');
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
      router.push('/auth');
    }
  }, [createToken, router]);

  if (!isverified || useVerifyToken.isPending)
    return (
      <section className='center-grid'>
        <SpinLoader size={100} thickness={2} color='#711e00' />
      </section>
    );

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
        <SpinLoader size={100} thickness={2} color='#711e00' />
      </section>
    }
  >
    <CreateUserPageContent />
  </Suspense>
);

export default CreateUserPage;
