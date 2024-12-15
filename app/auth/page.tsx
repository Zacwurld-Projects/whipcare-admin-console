'use client';
import { ChangeEvent, FormEvent, useState } from 'react';
import FormContainer from './components/FormContainer';
import InputArea from './components/InputArea';
import Link from 'next/link';
import FormButton from './components/FormButton';
import { doCredentialLogin } from '../actions/authActions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const response = await doCredentialLogin(formData);

      if (!!response.error) {
        toast.error(response.error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error('Invalid user details. Try again.');
    }
  };

  return (
    <section className='center-grid'>
      <FormContainer>
        <h3 className='heading-h3 text-center font-semibold text-gray-800'>Welcome back!</h3>
        <form className='flex-column w-full gap-8' onSubmit={(e) => handleSignIn(e)}>
          <InputArea
            type='email'
            name='email'
            value={userInfo.email}
            title='Email address'
            handleChange={handleInputChange}
          />
          <div className='flex-column w-full gap-2'>
            <InputArea
              type='password'
              name='password'
              value={userInfo.password}
              title='Password'
              handleChange={handleInputChange}
            />
            <Link
              href={'/auth/forgot-password'}
              className='text-xsmall self-end font-medium text-[#d35d24]'
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
