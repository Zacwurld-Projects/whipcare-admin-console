'use client';
import { ChangeEvent, useState } from 'react';
import FormContainer from '../components/FormContainer';
import InputArea from '../components/InputArea';
import FormButton from '../components/FormButton';
import EnterOtp from '../components/EnterOtp';
import SuccessCreate from '../components/SuccessCreate';
import { toast } from 'sonner';
import { defaultInfo, signUserIn } from '../mock';

const ForgotPassword = () => {
  const steps = ['input-email', 'input-otp', 'create-password', 'success'];
  const [currentStep, setCurrentStep] = useState(steps[0]);

  const [userInfo, setUserInfo] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <section className='center-grid'>
      {currentStep === 'input-email' && (
        <FormContainer>
          <h3 className='heading-h3 text-center font-semibold text-gray-800'>Forgot Password</h3>
          <p className='text-medium text-center text-[#5a524a]'>
            Enter email address registered with this account
          </p>
          <form
            className='flex-column w-full items-center gap-8'
            onSubmit={(e) => {
              e.preventDefault();
              toast.success('OTP sent to registered email');
              setCurrentStep(steps[1]);
            }}
          >
            <InputArea
              title='Email address'
              type='email'
              name='email'
              value={userInfo.email}
              handleChange={handleInputChange}
            />
            <FormButton text='Continue' type='submit' disabled={!userInfo.email} />
          </form>
        </FormContainer>
      )}
      {currentStep === 'input-otp' && (
        <EnterOtp action={() => setCurrentStep(steps[2])} sentOtp={defaultInfo.otp} />
      )}
      {currentStep === 'create-password' && (
        <FormContainer>
          <h3 className='heading-h3 font-semibold text-gray-800'>Create new password</h3>
          <form
            className='flex-column w-full items-center gap-8'
            onSubmit={(e) => {
              e.preventDefault();
              signUserIn();
              setCurrentStep(steps[3]);
            }}
          >
            <div className='flex-column w-full items-center gap-[18px]'>
              <InputArea
                type='password'
                name='newPassword'
                title='Password'
                handleChange={handleInputChange}
                value={userInfo.newPassword}
              />
              <div className='flex-column w-full gap-[8px]'>
                <InputArea
                  type='password'
                  name='confirmPassword'
                  title='Confirm Password'
                  handleChange={handleInputChange}
                  value={userInfo.confirmPassword}
                />
                <p
                  className={`text-xsmall self-end font-medium text-[#d34124] transition-opacity ${
                    userInfo.confirmPassword !== '' &&
                    userInfo.confirmPassword !== userInfo.newPassword
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
              className='-mt-[4px]'
              disabled={
                !userInfo.newPassword ||
                !userInfo.confirmPassword ||
                userInfo.newPassword !== userInfo.confirmPassword
              }
            />
          </form>
        </FormContainer>
      )}
      {currentStep === 'success' && <SuccessCreate />}
    </section>
  );
};
export default ForgotPassword;
