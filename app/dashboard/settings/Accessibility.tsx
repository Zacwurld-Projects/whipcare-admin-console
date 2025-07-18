'use client';
import FormButton from '@/app/auth/components/FormButton';
import NoMemberPlaceholderIcon from '../assets/noMemberPlaceholder.svg';
import DotsIcon from '../assets/dotsIcon.svg';
import { Dispatch, useState, useEffect, useRef } from 'react';
import InviteMemberModal from './InviteMemberModal';
import { useMutation } from '@tanstack/react-query';
import { inviteMember } from '@/app/api/apiClient';
import { toast } from 'sonner';
import TitleBox from './TitleBox';
import InviteMembersForm from './InviteMembersForm';
import Image from 'next/image';
import dayjs from 'dayjs';

const NoMembersPlaceholder = ({
  isDisplayingInviteModal,
  setIsDisplayingInviteModal,
}: {
  isDisplayingInviteModal: boolean;
  setIsDisplayingInviteModal: Dispatch<boolean>;
}) => {
  return (
    <article className='center-grid h-[80vh] w-full'>
      <div className='flex-column w-[321px] items-center gap-3'>
        <NoMemberPlaceholderIcon />
        <div className='w-full text-center'>
          <p className='font-medium text-gray-800 dark:text-white'>No member</p>
          <p className='text-small text-[#98a2b3] dark:text-dark-tertiary'>
            All admin members would be shown here
          </p>
        </div>
        <FormButton
          type='button'
          text='Add member'
          className='dark:bg-dark-accent'
          onClick={() => setIsDisplayingInviteModal(!isDisplayingInviteModal)}
        />
      </div>
    </article>
  );
};

const Accessibility = ({
  membersData,
}: {
  membersData: {
    _id: string;
    email: string;
    role: string;
    createdAt: string;
    name: string;
    image?: string;
    privileges?: string[];
  }[];
}) => {
  const [isDisplayingInviteModal, setIsDisplayingInviteModal] = useState(false);
  const [newMemberDetails, setNewMemberDetails] = useState({
    role: '',
    email: '',
  });
  const [newPrivileges, setNewPrivileges] = useState<string[]>([]);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [updateModalId, setUpdateModalId] = useState<string | null>(null);
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editPrivileges, setEditPrivileges] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // For update modal: use same roles and privileges as InviteMembersForm
  const roleOptions = ['admin', 'investor', 'marketer'];
  const allPrivileges = [
    { key: 'overview', label: 'Dashboard Overview' },
    { key: 'userManagement', label: 'User Management' },
    { key: 'serviceProvider', label: 'Service Provider Management' },
    { key: 'serviceBooking', label: 'Service Bookings' },
    { key: 'financials', label: 'Financial Reports' },
    { key: 'carManagement', label: 'Car Management' },
    { key: 'activities', label: 'Activities & Analytics' },
    { key: 'feedbacks', label: 'Feedback Management' },
    { key: 'marketing', label: 'Marketing & Campaigns' },
    { key: 'kyc', label: 'KYC Verification' },
    { key: 'cron', label: 'Cron Jobs & Automation' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpenId(null);
      }
    }
    if (dropdownOpenId) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpenId]);

  // Lock body scroll when update or delete modal is open
  useEffect(() => {
    if (updateModalId || deleteModalId) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [updateModalId, deleteModalId]);

  const inviteMembersMutation = useMutation({
    mutationKey: ['inviteMember'],
    mutationFn: () => {
      return inviteMember({ ...newMemberDetails, privileges: newPrivileges as [] });
    },
    onSuccess: (response) => {
      console.log('Invite member response:', response);
      toast.success('Invite sent to email');
      setNewMemberDetails({
        role: '',
        email: '',
      });
      setNewPrivileges([]);
      setIsDisplayingInviteModal(false);
    },
    onError: (error) => toast.error(error.message || 'Something went wrong.'),
  });

  const membersTableHeadings = ['Name', 'Date & time added', '  Role', ''];

  return (
    <>
      {membersData.length > 0 ? (
        <article>
          <div className='flex w-full gap-[190px] gap-y-8'>
            <TitleBox
              title='Add new member'
              content='You can add new member by sending invite to their email'
            />
            <div className='w-1/2 py-6 lg:mx-0'>
              <InviteMembersForm
                onSubmit={(_e, privileges) => {
                  setNewPrivileges(privileges);
                  setTimeout(() => inviteMembersMutation.mutate(), 0);
                }}
                isLoading={inviteMembersMutation.isPending}
                memberDetails={newMemberDetails}
                setMemberDetails={setNewMemberDetails}
              />
            </div>
          </div>
          <div className='mt-20 flex flex-wrap justify-between gap-y-8 border-t border-gray-100 py-6'>
            <TitleBox
              title='Members'
              content='Here is the list of members that have access to the admin'
            />
            <div className='w-full overflow-auto scrollbar lg:w-[650px]'>
              <table className='w-[800px] border-separate rounded-lg border border-gray-200 dark:border-dark-primary dark:bg-dark-secondary'>
                <thead>
                  <tr className='border-b border-gray-200 dark:border-dark-primary'>
                    {membersTableHeadings.map((item) => (
                      <th
                        key={item}
                        className='text-xsmall bg-gray-50 px-6 py-[13.5px] font-medium text-gray-700 dark:bg-dark-primary dark:text-white'
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {membersData.map((item) => (
                    <tr
                      key={item._id}
                      className='dark:bg-dark-secondary dark:text-white [&_td]:px-6 [&_td]:py-4'
                    >
                      <td className='flex items-center gap-3'>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name + 'image'}
                            height={40}
                            width={40}
                            className='size-10 rounded-full object-cover'
                          />
                        ) : (
                          <p className='center-grid size-10 rounded-full bg-primary-50 text-[#f56630]'>
                            {item.name.split(' ').map((item) => (
                              <>{item.slice(0, 1)}</>
                            ))}
                          </p>
                        )}
                        <div>
                          <p className='text-small font-medium text-gray-900 dark:text-white'>
                            {item.name}
                          </p>
                          <p className='text-small text-gray-500 dark:text-gray-300'>
                            {item.email}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p className='text-small text-gray-700 dark:text-gray-300'>
                          {dayjs(item.createdAt).format('MMM DD, YYYY | hh:mm A')}
                        </p>
                      </td>
                      <td>
                        <p className='text-small rounded-xl bg-primary-50 px-3 py-[2px] text-center font-medium capitalize text-[#983504] dark:bg-dark-primary dark:text-white'>
                          {item.role}
                        </p>
                      </td>
                      <td className='relative'>
                        <button
                          className='center-grid size-8 rounded-lg border border-gray-200'
                          onClick={() =>
                            setDropdownOpenId(dropdownOpenId === item._id ? null : item._id)
                          }
                        >
                          <DotsIcon />
                        </button>
                        {dropdownOpenId === item._id && (
                          <div
                            ref={dropdownRef}
                            className='fixed left-auto right-0 top-auto z-50 mt-0 w-56 rounded-lg border border-gray-200 bg-white shadow-lg'
                            style={{
                              minWidth: '14rem',
                              transform: 'translateY(-10px) translateX(-180px)',
                            }}
                          >
                            <button
                              className='block w-full px-4 py-2 text-left text-sm hover:bg-gray-100'
                              onClick={() => {
                                setUpdateModalId(item._id);
                                setEditRole(item.role);
                                setEditPrivileges(item.privileges || []);
                                setDropdownOpenId(null);
                              }}
                            >
                              Update roles and permission
                            </button>
                            <button
                              className='block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100'
                              onClick={() => {
                                setDeleteModalId(item._id);
                                setDropdownOpenId(null);
                              }}
                            >
                              Delete access
                            </button>
                          </div>
                        )}
                        {/* Update Modal */}
                        {updateModalId === item._id && (
                          <div
                            className='fixed inset-0 z-50 mt-40 flex items-center justify-center bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-80'
                            onClick={() => setUpdateModalId(null)}
                          >
                            <div
                              className='relative flex w-full max-w-2xl flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-2xl dark:bg-dark-secondary'
                              style={{ minWidth: '420px' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => setUpdateModalId(null)}
                                className='absolute left-4 top-8 rounded-full border bg-gray-100 p-2 text-2xl font-bold text-gray-400 transition-colors hover:text-black dark:border-gray-700 dark:bg-dark-primary dark:text-gray-300 dark:hover:text-white'
                                aria-label='Close modal'
                              >
                                <svg
                                  className='h-4 w-4'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M15 19l-7-7 7-7'
                                  />
                                </svg>
                              </button>
                              <div className='flex flex-col items-center justify-center gap-4 dark:text-white'>
                                <h1 className='mb-2 text-2xl font-semibold text-black dark:text-white'>
                                  Update Roles and Permission
                                </h1>
                                <div className='w-full'>
                                  <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200'>
                                    Name
                                  </label>
                                  <input
                                    type='text'
                                    value={item.name}
                                    disabled
                                    className='w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 dark:bg-dark-primary dark:text-white'
                                  />
                                </div>
                                <div className='mt-4 w-full'>
                                  <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200'>
                                    Role
                                  </label>
                                  <select
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                    className='w-full rounded border border-gray-300 px-3 py-2 text-gray-700 dark:bg-dark-primary dark:text-white'
                                  >
                                    {roleOptions.map((role) => (
                                      <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className='mt-4 w-full'>
                                  <label className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200'>
                                    Privileges
                                  </label>
                                  <div className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-800'>
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
                                                checked={editPrivileges.includes(priv.key)}
                                                onChange={() => {
                                                  if (editPrivileges.includes(priv.key)) {
                                                    setEditPrivileges(
                                                      editPrivileges.filter((p) => p !== priv.key),
                                                    );
                                                  } else {
                                                    setEditPrivileges([
                                                      ...editPrivileges,
                                                      priv.key,
                                                    ]);
                                                  }
                                                }}
                                                className='peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-gray-300 bg-white transition-all duration-150 checked:border-blue-600 checked:bg-blue-600 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:checked:border-blue-400 dark:checked:bg-blue-400'
                                              />
                                              <svg
                                                className='pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 transition-opacity duration-150 peer-checked:opacity-100'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'
                                                strokeWidth='3'
                                              >
                                                <path
                                                  strokeLinecap='round'
                                                  strokeLinejoin='round'
                                                  d='M5 13l4 4L19 7'
                                                />
                                              </svg>
                                            </div>
                                            <span className='text-sm font-medium text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white'>
                                              {priv.label}
                                            </span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='mt-6 flex w-full justify-end gap-2'>
                                  <button
                                    className='rounded bg-gray-200 px-4 py-2 text-gray-700 dark:bg-dark-primary dark:text-white'
                                    onClick={() => setUpdateModalId(null)}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className='rounded bg-primary-500 px-4 py-2 text-white'
                                    onClick={() => setUpdateModalId(null)}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Delete Modal */}
                        {deleteModalId === item._id && (
                          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-80'>
                            <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
                              <h2 className='mb-4 text-lg font-semibold text-gray-900'>
                                Delete Access
                              </h2>
                              <p className='mb-6 text-gray-700'>
                                Are you sure you want to delete{' '}
                                <span className='font-bold'>{item.name}</span> as user?
                              </p>
                              <div className='flex justify-end gap-2'>
                                <button
                                  className='rounded bg-gray-200 px-4 py-2 text-gray-700'
                                  onClick={() => setDeleteModalId(null)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className='rounded bg-red-600 px-4 py-2 text-white'
                                  onClick={() => setDeleteModalId(null)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      ) : (
        <NoMembersPlaceholder
          isDisplayingInviteModal={isDisplayingInviteModal}
          setIsDisplayingInviteModal={setIsDisplayingInviteModal}
        />
      )}
      {isDisplayingInviteModal && (
        <InviteMemberModal
          onSubmit={() => inviteMembersMutation.mutate()}
          isLoading={inviteMembersMutation.isPending}
          memberDetails={newMemberDetails}
          setMemberDetails={setNewMemberDetails}
          setIsDisplayingInviteModal={setIsDisplayingInviteModal}
        />
      )}
    </>
  );
};
export default Accessibility;
