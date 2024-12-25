'use client';
import { ChangeEvent, useState } from 'react';
import FormContainer from './components/FormContainer';
import InputArea from './components/InputArea';
import Link from 'next/link';
import FormButton from './components/FormButton';
import { doCredentialLogin } from '../actions/authActions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

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

  const loginMutation = useMutation({
    mutationKey: ['loginUser'],
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('email', userInfo.email);
      formData.append('password', userInfo.password);
      return doCredentialLogin(formData);
    },
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error.message);
      } else {
        toast.success('Login successful!');
        router.push('/dashboard');
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error('Invalid user details. Try again.');
    },
  });

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate();
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
            isLoading={loginMutation.isPending}
            disabled={!userInfo.email || !userInfo.password || loginMutation.isPending}
          />
        </form>
      </FormContainer>
    </section>
  );
};
export default SignInPage;
