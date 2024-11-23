"use client";
import { ChangeEvent, use, useState } from "react";
import FormContainer from "../components/FormContainer";
import InputArea from "../components/InputArea";
import FormButton from "../components/FormButton";
import EnterOtp from "../components/EnterOtp";
import SuccessCreate from "../components/SuccessCreate";

const ForgotPassword = () => {
  const steps = ["input-email", "input-otp", "create-password", "success"];
  const [currentStep, setCurrentStep] = useState(steps[2]);

  const [userInfo, setUserInfo] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <section className='center-grid'>
      {currentStep === "input-email" && (
        <FormContainer>
          <h3 className='text-center heading-h3 font-semibold text-gray-800'>
            Forgot Password
          </h3>
          <p className='text-medium text-[#5a524a] text-center'>
            Enter email address registered with this account
          </p>
          <form className='flex-column w-full items-center gap-8'>
            <InputArea
              title='Email address'
              type='email'
              name='email'
              value={userInfo.email}
              handleChange={handleInputChange}
            />
            <FormButton
              text='Continue'
              type='submit'
              disabled={!userInfo.email}
            />
          </form>
        </FormContainer>
      )}
      {currentStep === "input-otp" && (
        <EnterOtp action={() => setCurrentStep(steps[2])} />
      )}
      {currentStep === "create-password" && (
        <FormContainer>
          <h3 className='heading-h3 text-gray-800 font-semibold'>
            Create new password
          </h3>
          <form
            className='flex-column w-full items-center gap-8'
            onSubmit={() => setCurrentStep(steps[3])}
          >
            <div className='w-full gap-[18px] items-center flex-column'>
              <InputArea
                type='password'
                name='newPassword'
                title='Password'
                handleChange={handleInputChange}
                value={userInfo.newPassword}
              />
              <InputArea
                type='password'
                name='confirmPassword'
                title='Confirm Password'
                handleChange={handleInputChange}
                value={userInfo.confirmPassword}
              />
            </div>
            <FormButton
              type='submit'
              text='Continue'
              disabled={
                !userInfo.newPassword ||
                !userInfo.confirmPassword ||
                userInfo.newPassword !== userInfo.confirmPassword
              }
            />
          </form>
        </FormContainer>
      )}
      {currentStep === "success" && <SuccessCreate />}
    </section>
  );
};
export default ForgotPassword;
