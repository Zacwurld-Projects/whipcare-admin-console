'use client';
import { ChangeEvent, useState } from 'react';
import FormContainer from '../components/FormContainer';
import InputArea from '../components/InputArea';
import FormButton from '../components/FormButton';
import EnterOtp from '../components/EnterOtp';
import SuccessCreate from '../components/SuccessCreate';
import { defaultInfo, signUserIn } from '../mock';

const CreateUserPage = () => {
  const steps = ['input-userInfo', 'input-otp', 'success'];
  const [currentStep, setCurrentStep] = useState(steps[0]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className='center-grid'>
      {currentStep === 'input-userInfo' && (
        <FormContainer>
          <h3 className='heading-h3 font-semibold text-gray-800'>Create an account</h3>
          <form
            className='flex-column w-full gap-8'
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentStep(steps[1]);
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
                value={userInfo.email}
              />
              <InputArea
                title='Password'
                type='password'
                handleChange={handleInputChange}
                name='password'
                value={userInfo.password}
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
                    userInfo.confirmPassword !== userInfo.password
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
                !userInfo.name ||
                !userInfo.email ||
                !userInfo.password ||
                !userInfo.confirmPassword ||
                userInfo.confirmPassword !== userInfo.password
              }
            />
          </form>
        </FormContainer>
      )}
      {currentStep === 'input-otp' && (
        <EnterOtp
          action={() => {
            signUserIn();
            setCurrentStep(steps[2]);
          }}
          sentOtp={defaultInfo.otp}
        />
      )}
      {currentStep === 'success' && <SuccessCreate />}
    </section>
  );
};
export default CreateUserPage;
