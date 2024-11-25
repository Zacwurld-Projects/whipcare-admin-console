"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import FormContainer from "./components/FormContainer";
import InputArea from "./components/InputArea";
import Link from "next/link";
import FormButton from "./components/FormButton";
import { defaultInfo, signUserIn } from "./mock";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = defaultInfo;
    if (userInfo.email !== email || userInfo.password !== password)
      toast.error("Invalid user details. Try again.");
    else {
      signUserIn();
      router.push("/dashboard");
    }
  };

  return (
    <section className='center-grid'>
      <FormContainer>
        <h3 className='heading-h3 font-semibold text-gray-800 text-center'>
          Welcome back!
        </h3>
        <form
          className='flex-column gap-8 w-full'
          onSubmit={(e) => handleSignIn(e)}
        >
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
