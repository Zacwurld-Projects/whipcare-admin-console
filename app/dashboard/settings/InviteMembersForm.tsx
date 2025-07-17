import useMenu from '@/app/hooks/useMenu';
import { Dispatch, FormEvent, useRef, useState, useEffect } from 'react';
import ChevronDownIcon from '../assets/chevronDown.svg';
import FormButton from '@/app/auth/components/FormButton';

const InviteMembersForm = ({
  onSubmit,
  memberDetails,
  setMemberDetails,
  isLoading,
}: {
  onSubmit: (e: FormEvent, privileges: string[]) => void;
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
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  // Static privileges list (replace with your actual privileges)
  const allPrivileges = [
    { key: 'overview', label: 'Dashboard Overview' },
    { key: 'userManagement', label: 'User Management' },
    { key: 'serviceProvider', label: 'Service Provider Management' },
    { key: 'serviceBooking', label: 'Service Bookings' },
    { key: 'financials', label: 'Financial Reports' },
    { key: 'carManagement', label: 'Car Management' },
    { key: 'activity', label: 'Activities & Analytics' },
    { key: 'feedback', label: 'Feedback Management' },
    { key: 'marketing', label: 'Marketing & Campaigns' },
    { key: 'kyc', label: 'KYC Verification' },
    { key: 'cron', label: 'Cron Jobs & Automation' },
    { key: 'userManagementView', label: 'User Management (View Only)' },
    { key: 'serviceProviderView', label: 'Service Provider Management (View Only)' },
  ];

  // Default privileges for each role
  const rolePrivileges: Record<string, string[]> = {
    admin: allPrivileges.map((p) => p.key),
    investor: [
      'overview',
      'financials',
      'serviceBooking',
      'activity',
      'userManagementView',
      'serviceProviderView',
    ],
    marketer: [
      'overview',
      'marketing',
      'userManagementView',
      'serviceProviderView',
      'activity',
      'feedback',
    ],
  };

  const roleInputRef = useRef<HTMLInputElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  const { isMenuOpen, setIsMenuOpen } = useMenu(roleInputRef, roleMenuRef);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleRoleSelect = (role: string) => {
    if (role === 'custom') {
      setIsCustomRole(true);
      setMemberDetails({ ...memberDetails, role: '' });
      setSelectedPermissions([]); // Reset permissions for custom role
    } else {
      setIsCustomRole(false);
      setMemberDetails({ ...memberDetails, role });
      // Set default privileges for the selected role
      setSelectedPermissions(rolePrivileges[role] || []);
    }
    setTimeout(() => setIsMenuOpen(false), 100);
  };

  const handleCustomRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemberDetails({ ...memberDetails, role: e.target.value });
  };

  const handlePermissionToggle = (privilegeKey: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(privilegeKey)
        ? prev.filter((p) => p !== privilegeKey)
        : [...prev, privilegeKey],
    );
  };

  const handleSelectAll = () => {
    setSelectedPermissions(allPrivileges.map((p) => p.key));
  };

  const handleClearAll = () => {
    setSelectedPermissions([]);
  };

  // Track previous isLoading to detect when invite is sent
  const prevIsLoading = useRef(isLoading);
  useEffect(() => {
    if (prevIsLoading.current && !isLoading) {
      // Invite was just sent, reset form
      setMemberDetails({ role: '', email: '' });
      setSelectedPermissions([]);
      setIsCustomRole(false);
    }
    prevIsLoading.current = isLoading;
  }, [isLoading, setMemberDetails]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Send selected privilege keys directly
        const privileges = selectedPermissions;
        onSubmit(e, privileges);
      }}
      className='flex-column w-full gap-8'
    >
      <div className='flex-column w-full gap-6'>
        {/* Role Selection */}
        <div className='flex-column gap-3'>
          <label htmlFor='role' className='flex-column relative gap-2'>
            <p className='text-sm font-semibold text-gray-800 dark:text-white'>Role</p>
            <div className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:focus-within:border-blue-400 dark:hover:border-gray-500'>
              <input
                type='text'
                value={memberDetails.role}
                placeholder={isCustomRole ? 'Enter custom role' : 'Select role'}
                readOnly={!isCustomRole}
                required
                className='flex-1 cursor-pointer bg-transparent text-sm capitalize focus:outline-none dark:text-white dark:placeholder:text-gray-400'
                id='role'
                name='role'
                ref={roleInputRef}
                onClick={!isCustomRole ? handleToggleMenu : undefined}
                onChange={isCustomRole ? handleCustomRoleChange : undefined}
              />
              {!isCustomRole && (
                <ChevronDownIcon className='h-5 w-5 text-gray-500 transition-transform duration-200 dark:text-gray-400' />
              )}
            </div>
            {isMenuOpen && !isCustomRole && (
              <div
                ref={roleMenuRef}
                className='absolute right-0 top-[110%] z-20 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800'
              >
                {roleOptions.map((item) => (
                  <button
                    type='button'
                    className='w-full bg-white p-3 text-left text-sm font-medium capitalize text-gray-800 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                    key={item}
                    onClick={() => handleRoleSelect(item)}
                  >
                    {item}
                  </button>
                ))}
                <div className='border-t border-gray-200 dark:border-gray-600'>
                  <button
                    type='button'
                    className='w-full bg-white p-3 text-left text-sm font-medium text-blue-600 transition-colors duration-150 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700'
                    onClick={() => handleRoleSelect('custom')}
                  >
                    Custom...
                  </button>
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Interactive Permissions Checklist */}
        <div className='flex-column gap-4'>
          <div className='flex items-center justify-between'>
            <div className='flex-column gap-1'>
              <p className='text-sm font-semibold text-gray-800 dark:text-white'>
                Access Permissions
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Select the pages this member can access
              </p>
            </div>
            <div className='flex gap-3'>
              <button
                type='button'
                onClick={handleSelectAll}
                className='rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors duration-150 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
              >
                Select All
              </button>
              <button
                type='button'
                onClick={handleClearAll}
                className='rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors duration-150 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
              >
                Clear All
              </button>
            </div>
          </div>

          <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-600 dark:bg-gray-800'>
            <div className='max-h-64 overflow-y-auto'>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                {allPrivileges.map((priv) => (
                  <label
                    key={priv.key}
                    className='group flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 p-3 transition-all duration-150 hover:border-blue-200 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20'
                  >
                    <div className='relative'>
                      <input
                        type='checkbox'
                        checked={selectedPermissions.includes(priv.key)}
                        onChange={() => handlePermissionToggle(priv.key)}
                        className='peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 bg-white transition-all duration-150 checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:checked:border-blue-400 dark:checked:bg-blue-400'
                      />
                      <svg
                        className='pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 transition-opacity duration-150 peer-checked:opacity-100'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth='3'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                      </svg>
                    </div>
                    <span className='text-sm font-medium text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white'>
                      {priv.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {selectedPermissions.length === 0 && (
              <div className='mt-4 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-700/50'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  No permissions selected. Please select at least one permission.
                </p>
              </div>
            )}

            {selectedPermissions.length > 0 && (
              <div className='mt-4 rounded-lg bg-green-50 p-3 dark:bg-green-900/20'>
                <p className='text-sm font-medium text-green-700 dark:text-green-300'>
                  {selectedPermissions.length} permission
                  {selectedPermissions.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Email Input */}
        <div className='flex-column gap-3'>
          <label className='flex-column gap-2'>
            <p className='text-sm font-semibold text-gray-800 dark:text-white'>Email address</p>
            <div className='rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:focus-within:border-blue-400 dark:hover:border-gray-500'>
              <input
                className='w-full bg-transparent text-sm text-gray-800 focus:outline-none dark:text-white dark:placeholder:text-gray-400'
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
      </div>

      <FormButton
        disabled={
          isLoading ||
          !memberDetails.email ||
          !memberDetails.role ||
          selectedPermissions.length === 0
        }
        isLoading={isLoading}
        className='dark:bg-dark-accent'
        type='submit'
        text='Send Invite Link'
      />
    </form>
  );
};
export default InviteMembersForm;
