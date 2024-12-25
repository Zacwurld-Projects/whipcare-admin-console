'use client';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import FormButton from './FormButton';
import FormContainer from './FormContainer';

const EnterOtp = ({
  action,
  otp,
  setOtp,
  isLoading,
  resendAction,
}: {
  action: () => void;
  isLoading: boolean;
  otp: Array<string>;
  resendAction: () => void;
  setOtp: Dispatch<SetStateAction<string[]>>;
}) => {
  // const [otp, setOtp] = useState(Array(6).fill(''));
  const [countdown, setCountdown] = useState({
    mins: 2,
    secs: 0,
  });

  const otpInputRefs = useRef<HTMLInputElement[]>([]);

  //   timer interval
  useEffect(() => {
    let timeRemaining = countdown.mins * 60 + countdown.secs;

    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        setCountdown({
          mins: Math.floor(timeRemaining / 60),
          secs: timeRemaining % 60,
        });
      } else clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

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
    if (pos < otp.length - 1 && value !== '')
      focusElementAndSelectValues(otpInputRefs.current[pos + 1]);
  };

  const handleKeyDown = (pos: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (otp[pos] !== '') {
        setOtp((prev) => {
          return prev.map((item, index) => {
            if (index < pos) return item;
            return prev[index + 1] || '';
          });
        });
        return;
      }
      if (pos > 0) focusElementAndSelectValues(otpInputRefs.current[pos - 1]);
    }

    if (!isNaN(Number(e.key))) handleInputChange(e.key, pos);

    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      if (pos > 0) focusElementAndSelectValues(otpInputRefs.current[pos - 1]);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      if (otp[pos] !== '' && otp[pos + 1] !== '' && pos < otp.length - 1)
        focusElementAndSelectValues(otpInputRefs.current[pos + 1]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, pos: number) => {
    const pastedText = e.clipboardData.getData('text');
    if (!/^\d+$/.test(pastedText) || pastedText.length > otp.length - pos) return;

    setOtp((prev) => {
      const updatedOtp = [...prev];
      let pastedIndex = pos;

      // iterate through otp from the current position
      for (let i = pos; i < updatedOtp.length && pastedIndex < pastedText.length; i++) {
        if (updatedOtp[i] === '') {
          updatedOtp[i] = pastedText[pastedIndex++];
        }
      }

      return updatedOtp;
    });
  };

  const shiftFocusToCurrentPos = () => {
    const currentDigitPos = otp.findIndex((item) => item === '');
    if (currentDigitPos >= 0) focusElementAndSelectValues(otpInputRefs.current[currentDigitPos]);
    else focusElementAndSelectValues(otpInputRefs.current[otp.length - 1]);
  };

  return (
    <FormContainer>
      <h3 className='heading-h3 font-semibold text-gray-800'>Enter OTP</h3>
      <p className='text-medium text-center text-gray-500'>
        A 6-digit OTP (one time password) has been sent to your e-mail for verification.
      </p>
      <form
        className='flex-column w-full gap-8'
        onSubmit={(e) => {
          e.preventDefault();
          action();
        }}
      >
        <div className='flex-column w-full gap-2'>
          <div className='flex w-full items-center justify-center gap-6'>
            {otp.map((value, index) => (
              <label
                htmlFor={`otp-${index}`}
                key={index}
                onClick={shiftFocusToCurrentPos}
                className='center-grid size-[50px] rounded-[5px] bg-gray-50'
              >
                <input
                  type='text'
                  name={`otp-${index}`}
                  id={`otp-${index}`}
                  value={value}
                  aria-label={'otp digit ' + index + 1}
                  onPaste={(e) => handlePaste(e, index)}
                  onClick={shiftFocusToCurrentPos}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => {
                    otpInputRefs.current[index] = el!;
                  }}
                  maxLength={1}
                  placeholder='_'
                  className='text-medium placeholder:text-medium h-[23px] w-[34.5px] bg-inherit text-center font-medium text-gray-700 placeholder:font-medium placeholder:text-gray-700 focus:outline-none'
                />
              </label>
            ))}
          </div>
          <div className='flex w-full items-center justify-between'>
            <div className='text-medium flex gap-1'>
              <p className='text-gray-900'>Didn’t get a code?</p>
              <button
                disabled={countdown.mins * 60 + countdown.secs > 0}
                onClick={async () => {
                  resendAction();
                  setOtp(Array(6).fill(''));
                  setCountdown({ mins: 2, secs: 0 });
                }}
                className='font-medium text-[#d35d24] transition-opacity disabled:opacity-50'
              >
                Resend
              </button>
            </div>
            <p className='text-small font-medium text-gray-600'>
              {countdown.mins}:{countdown.secs.toString().padStart(2, '0')}
            </p>
          </div>
        </div>
        <FormButton
          type='submit'
          isLoading={isLoading}
          text='Verify code'
          disabled={typeof otp.find((item) => item === '') !== 'undefined' || isLoading}
        />
      </form>
    </FormContainer>
  );
};
export default EnterOtp;
