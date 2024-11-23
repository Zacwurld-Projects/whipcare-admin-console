"use client";
import { useState } from "react";
import FormContainer from "../components/FormContainer";
import InputArea from "../components/InputArea";
import FormButton from "../components/FormButton";
import EnterOtp from "../components/EnterOtp";
import SuccessCreate from "../components/SuccessCreate";

const ForgotPassword = () => {
  const steps = ["input-email", "input-otp", "create-password", "success"];
  const [email, setEmail] = useState("");
  const [currentStep, setCurrentStep] = useState(steps[0]);

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
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
            />
            <FormButton text='Continue' type='submit' disabled={!email} />
          </form>
        </FormContainer>
      )}
      {currentStep === "input-otp" && (
        <EnterOtp action={() => setCurrentStep(steps[2])} />
      )}
      {currentStep === "success" && <SuccessCreate />}
    </section>
  );
};
export default ForgotPassword;
