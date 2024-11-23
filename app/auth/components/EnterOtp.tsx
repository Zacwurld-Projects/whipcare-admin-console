"use client";
import { useRef, useState } from "react";
import FormButton from "./FormButton";
import FormContainer from "./FormContainer";

const EnterOtp = ({ action }: { action: () => void }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpInputRefs = useRef<HTMLInputElement[]>([]);

  const focusElementAndSelectValues = (element: HTMLInputElement) => {
    element.focus();
    setTimeout(() => element.setSelectionRange(0, 1), 0);
  };

  const handleInputChange = (value: string, pos: number) => {
    if (!/^\d$/.test(value)) return;
    let updatedOtp = [...otp];
    updatedOtp = updatedOtp.map((item, index) => {
      if (index === pos) return value;
      return item;
    });
    setOtp(updatedOtp);
    if (pos < otp.length - 1 && value !== "")
      focusElementAndSelectValues(otpInputRefs.current[pos + 1]);
  };

  const handleKeyDown = (
    pos: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      if (otp[pos] !== "") {
        setOtp((prev) => {
          return prev.map((item, index) => {
            if (index < pos) return item;
            return prev[index + 1] || "";
          });
        });
        return;
      }
      if (pos > 0) focusElementAndSelectValues(otpInputRefs.current[pos - 1]);
    }

    if (!isNaN(Number(e.key))) handleInputChange(e.key, pos);

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      if (pos > 0) focusElementAndSelectValues(otpInputRefs.current[pos - 1]);
    }
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      if (otp[pos] !== "" && otp[pos + 1] !== "" && pos < otp.length - 1)
        focusElementAndSelectValues(otpInputRefs.current[pos + 1]);
    }
  };

  const shiftFocusToCurrentPos = () => {
    const currentDigitPos = otp.findIndex((item) => item === "");
    if (currentDigitPos >= 0)
      focusElementAndSelectValues(otpInputRefs.current[currentDigitPos]);
    else focusElementAndSelectValues(otpInputRefs.current[otp.length - 1]);
  };

  return (
    <FormContainer>
      <h3 className='heading-h3 font-semibold text-gray-800'>Enter OTP</h3>
      <p className='text-medium text-gray-500 text-center'>
        A 6-digit OTP (one time password) has been sent to your e-mail for
        verification.
      </p>
      <form
        className='w-full flex-column gap-8'
        onSubmit={(e) => {
          e.preventDefault();
          console.log(otp);
          action();
        }}
      >
        <div className='flex-column gap-2 w-full'>
          <div className='flex items-center w-full justify-center gap-6'>
            {otp.map((value, index) => (
              <label
                htmlFor={`otp-${index}`}
                key={index}
                onClick={shiftFocusToCurrentPos}
                className='center-grid size-[50px] bg-gray-50 rounded-[5px]'
              >
                <input
                  type='text'
                  name={`otp-${index}`}
                  id={`otp-${index}`}
                  value={value}
                  aria-label={"otp digit " + index + 1}
                  onClick={shiftFocusToCurrentPos}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => {
                    otpInputRefs.current[index] = el!;
                  }}
                  maxLength={1}
                  placeholder='_'
                  className='w-[34.5px] h-[23px] bg-inherit text-center text-medium font-medium text-gray-700 placeholder:text-medium placeholder:font-medium placeholder:text-gray-700 focus:outline-none'
                />
              </label>
            ))}
          </div>
          <div className='flex w-full justify-between items-center'>
            <div className='text-medium flex gap-1'>
              <p className='text-gray-900'>Didn’t get a code?</p>
              <button className='text-[#d35d24] font-medium'>Resend</button>
            </div>
            <p className='text-small font-medium text-gray-600'>2:00</p>
          </div>
        </div>
        <FormButton
          type='submit'
          text='Verify code'
          disabled={typeof otp.find((item) => item === "") !== "undefined"}
        />
      </form>
    </FormContainer>
  );
};
export default EnterOtp;
