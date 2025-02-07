import FormButton from '@/app/auth/components/FormButton';
import InputArea from '@/app/auth/components/InputArea';
import StylusIcon from '../assets/stylusIcon.svg';
import { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';
import TitleBox from './TitleBox';
import { useMutation } from '@tanstack/react-query';
import { changeUserPassword, fetchSettingsProfile, updateUserProfile } from '@/app/api/apiClient';
import { toast } from 'sonner';
import { useGlobalContext } from '@/app/context/AppContext';

type UserData = { email: string; name: string; role: string; image?: string };

const Profile = ({ profileData }: { profileData: UserData }) => {
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    role: string;
    image: string | undefined;
    imageBlob: File | null;
  }>({
    name: profileData.name,
    email: profileData.email,
    role: profileData.role,
    image: profileData.image || undefined,
    imageBlob: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const { setUserDetails, userDetails } = useGlobalContext();

  const updateProfile = useMutation({
    mutationKey: ['updateProfileData'],
    mutationFn: async () => {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (
          key !== 'image' &&
          typeof value === 'string' &&
          value !== profileData[key as keyof typeof profileData]
        ) {
          formData.append(key, value);
        }
        if (key === 'image' && value !== profileData.image) {
          formData.append(key, userData.imageBlob as File);
        }
      });
      return updateUserProfile(formData);
    },
    onSuccess: async () => {
      const response = await fetchSettingsProfile();
      if (response) setUserDetails({ id: userDetails.id, ...response.data });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong');
    },
  });

  const changePassword = useMutation({
    mutationKey: ['chnageUserPassword'],
    mutationFn: async () => changeUserPassword(passwordData),
    onSuccess: () => toast.success('Password updated successfully'),
    onError: (error) => toast.error(error.message || 'Something went wrong'),
  });

  const handleUpdateUserProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile.mutate();
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    changePassword.mutate();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleImageChnage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    if (files)
      setUserData({
        ...userData,
        imageBlob: files[0],
        image: URL.createObjectURL(files[0]),
      });
  };

  const isUserDataEdited =
    userData.email !== profileData.email ||
    userData.name !== profileData.name ||
    userData.role !== profileData.role ||
    userData.image !== profileData.image ||
    updateProfile.isPending;

  const handlePasswordChnage = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  return (
    <article className=''>
      <div className='flex flex-wrap justify-between gap-y-8'>
        <TitleBox title='Account profile' content='You can edit the information on your profile' />
        <form
          onSubmit={handleUpdateUserProfile}
          className='mx-auto flex flex-wrap gap-x-14 gap-y-10 px-6 py-8 lg:mx-0'
        >
          <div className='flex-column gap-5'>
            {userData.image ? (
              <Image
                src={userData.image}
                alt={profileData.name + ' profile image'}
                height={130}
                width={130}
                className='size-[130px] rounded-full object-cover'
              />
            ) : (
              <p className='center-grid size-[130px] rounded-full bg-primary-50 text-[39px] font-semibold text-[#f56630] dark:text-dark-accent'>
                {profileData.name.split(' ').map((t) => (
                  <>{t.slice(0, 1).toUpperCase()}</>
                ))}
              </p>
            )}
            <label
              htmlFor='editPhoto'
              className='flex w-[157px] items-center justify-center gap-1 rounded border border-gray-300 py-[6px] dark:border-white'
            >
              <StylusIcon className='dark:*:fill-dark-tertiary' />
              <p className='text-small text-gray-500 dark:text-dark-tertiary'>Edit Photo</p>
              <input
                type='file'
                onChange={handleImageChnage}
                accept='image/*'
                name='editPhoto'
                id='editPhoto'
                className='hidden'
              />
            </label>
          </div>
          <div className='w-full lg:w-[480px]'>
            <div className='flex-column w-full gap-4'>
              <InputArea
                name='name'
                value={userData.name}
                type='text'
                title='Full name'
                className='dark:border-dark-tertiary dark:[&_.title]:text-dark-tertiary dark:[&_input]:text-white'
                handleChange={handleChange}
              />
              <InputArea
                name='email'
                value={userData.email}
                type='email'
                title='Email address'
                className='dark:border-dark-tertiary dark:[&_.title]:text-dark-tertiary dark:[&_input]:text-white'
                handleChange={handleChange}
              />
              <InputArea
                name='role'
                value={userData.role}
                type='text'
                title='Role'
                className='dark:border-dark-tertiary dark:[&_.title]:text-dark-tertiary dark:[&_input]:text-white'
                handleChange={handleChange}
              />
              <FormButton
                type='submit'
                text='Save'
                className='dark:bg-dark-accent'
                isLoading={updateProfile.isPending}
                disabled={!isUserDataEdited || updateProfile.isPending}
              />
            </div>
          </div>
        </form>
      </div>
      <div className='mt-20 flex flex-wrap gap-x-[170px] gap-y-8 border-t border-gray-100 py-6'>
        <TitleBox
          title='Change password'
          content='Set up a new password. Login with this new password'
        />
        <form
          onSubmit={handleChangePassword}
          className='flex-column mx-auto w-[480px] gap-4 lg:mx-0'
        >
          <InputArea
            type='password'
            name='currentPassword'
            title='Current password'
            className='dark:border-dark-tertiary dark:[&_.title]:text-dark-tertiary dark:[&_input]:text-white'
            value={passwordData.currentPassword}
            handleChange={handlePasswordChnage}
          />
          <InputArea
            type='password'
            name='newPassword'
            title='New password'
            className='dark:border-dark-tertiary dark:[&_.title]:text-dark-tertiary dark:[&_input]:text-white'
            value={passwordData.newPassword}
            handleChange={handlePasswordChnage}
          />
          <div className='flex-column gap-2'>
            <InputArea
              type='password'
              name='confirmNewPassword'
              title='Confirm password'
              className='dark:border-dark-tertiary dark:[&_.title]:text-dark-tertiary dark:[&_input]:text-white'
              value={passwordData.confirmNewPassword}
              handleChange={handlePasswordChnage}
            />
            <p
              className={`text-xsmall self-end font-medium text-[#d34124] transition-all ${
                passwordData.confirmNewPassword !== '' &&
                passwordData.confirmNewPassword !== passwordData.newPassword
                  ? 'h-auto opacity-100'
                  : 'h-0 opacity-0'
              }`}
            >
              Passwords do not match
            </p>
          </div>
          <FormButton
            text='Change Password'
            type='submit'
            className='dark:bg-dark-accent'
            isLoading={changePassword.isPending}
            disabled={
              !passwordData.currentPassword ||
              !passwordData.confirmNewPassword ||
              !passwordData.newPassword ||
              passwordData.confirmNewPassword !== passwordData.newPassword ||
              changePassword.isPending
            }
          />
        </form>
      </div>
    </article>
  );
};
export default Profile;
