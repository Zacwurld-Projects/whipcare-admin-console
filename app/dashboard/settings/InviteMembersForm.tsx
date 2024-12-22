import useMenu from '@/app/hooks/useMenu';
import { Dispatch, FormEvent, useRef } from 'react';
import ChevronDownIcon from '../assets/chevronDown.svg';
import FormButton from '@/app/auth/components/FormButton';

const InviteMembersForm = ({
  onSubmit,
  memberDetails,
  setMemberDetails,
  isLoading,
}: {
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  memberDetails: {
    role: string;
    email: string;
  };
  setMemberDetails: Dispatch<{
    role: string;
    email: string;
  }>;
}) => {
  const roleOptions = ['admin', 'investor', 'marketer'];

  const roleInputRef = useRef<HTMLInputElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  const { isMenuOpen, setIsMenuOpen } = useMenu(roleInputRef, roleMenuRef);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleRoleSelect = (role: string) => {
    setMemberDetails({ ...memberDetails, role });
    setTimeout(() => setIsMenuOpen(false), 100);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className='flex-column w-full gap-7'
    >
      <div className='flex-column w-full gap-3'>
        <label htmlFor='role' className='flex-column relative gap-1'>
          <p className='text-xsmall font-medium text-gray-800'>Role</p>
          <div className='flex items-center gap-1 rounded-[5px] border border-gray-200 p-4'>
            <input
              type='text'
              value={memberDetails.role}
              placeholder='Select role'
              readOnly
              required
              className='text-xsmall flex-1 cursor-pointer capitalize focus:outline-none'
              id='role'
              name='role'
              ref={roleInputRef}
              onClick={handleToggleMenu}
            />
            <ChevronDownIcon className='*:stroke-gray-500' />
          </div>
          {isMenuOpen && (
            <div
              ref={roleMenuRef}
              className='flex-column absolute right-0 top-[110%] z-20 w-[200px] overflow-hidden rounded border bg-white shadow-md'
            >
              {roleOptions.map((item) => (
                <button
                  type='button'
                  className='text-xsmall w-full bg-white p-2 text-start font-medium capitalize text-gray-800 hover:bg-gray-200'
                  key={item}
                  onClick={() => handleRoleSelect(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </label>
        <label className='flex-column gap-1'>
          <p className='text-xsmall font-medium text-gray-800'>Email address</p>
          <div className='rounded-[5px] border border-gray-200 p-4'>
            <input
              className='text-xsmall w-full text-gray-800 focus:outline-none'
              type='email'
              placeholder='Enter email address'
              name='email'
              id='email'
              required
              value={memberDetails.email}
              onChange={(e) => setMemberDetails({ ...memberDetails, email: e.target.value })}
            />
          </div>
        </label>
      </div>
      <FormButton
        disabled={isLoading || !memberDetails.email || !memberDetails.role}
        isLoading={isLoading}
        type='submit'
        text='Send Invite Link'
      />
    </form>
  );
};
export default InviteMembersForm;
