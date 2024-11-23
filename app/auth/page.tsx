"use client";
import { ChangeEvent, useState } from "react";
import FormContainer from "./components/FormContainer";
import InputArea from "./components/InputArea";
import Link from "next/link";
import FormButton from "./components/FormButton";

const SignInPage = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className='center-grid'>
      <FormContainer>
        <h3 className='heading-h3 font-semibold text-gray-800 text-center'>
          Welcome back!
        </h3>
        <form className='flex-column gap-8 w-full'>
          <InputArea
            type='email'
            name='email'
            value={userInfo.email}
            title='Email address'
            handleChange={handleInputChange}
          />
          <div className='w-full flex-column gap-2'>
            <InputArea
              type='password'
              name='password'
              value={userInfo.password}
              title='Password'
              handleChange={handleInputChange}
            />
            <Link
              href={"/auth/forgot-password"}
              className='text-[#d35d24] text-xsmall self-end font-medium'
            >
              Forgot Password?
            </Link>
          </div>
          <FormButton
            type='submit'
            text='Continue'
            disabled={!userInfo.email || !userInfo.password}
          />
        </form>
      </FormContainer>
    </section>
  );
};
export default SignInPage;
