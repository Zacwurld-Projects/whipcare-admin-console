'use server';

import { signIn, signOut } from '@/auth';

export async function doCredentialLogin(formData: FormData) {
  try {
    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });
    return response;
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function doLogout() {
  await signOut({ redirectTo: '/auth' });
}
