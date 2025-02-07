'use client';
import FormButton from '@/app/auth/components/FormButton';
import NoMemberPlaceholderIcon from '../assets/noMemberPlaceholder.svg';
import DotsIcon from '../assets/dotsIcon.svg';
import { Dispatch, useState } from 'react';
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
  }[];
}) => {
  const [isDisplayingInviteModal, setIsDisplayingInviteModal] = useState(false);

  const [newMemberDetails, setNewMemberDetails] = useState({
    role: '',
    email: '',
  });

  const inviteMembersMutation = useMutation({
    mutationKey: ['inviteMember'],
    mutationFn: () => {
      return inviteMember(newMemberDetails);
    },
    onSuccess: () => {
      toast.success('Invite sent to email');
      setNewMemberDetails({
        role: '',
        email: '',
      });
      setIsDisplayingInviteModal(false);
    },
    onError: (error) => toast.error(error.message || 'Something went wrong.'),
  });

  const membersTableHeadings = ['Name', 'Date & time added', '  Role', ''];

  return (
    <>
      {membersData.length < 0 ? (
        <article>
          <div className='flex flex-wrap gap-x-[190px] gap-y-8'>
            <TitleBox
              title='Add new member'
              content='You can add new member by sending invite to their email'
            />
            <div className='mx-auto w-[386px] py-6 lg:mx-0'>
              <InviteMembersForm
                onSubmit={() => inviteMembersMutation.mutate()}
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
              <table className='w-[800px] border-separate rounded-lg border border-gray-200'>
                <thead>
                  <tr className='border-b border-gray-200'>
                    {membersTableHeadings.map((item) => (
                      <th
                        key={item}
                        className='text-xsmall bg-gray-50 px-6 py-[13.5px] font-medium text-gray-700'
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {membersData.map((item) => (
                    <tr key={item._id} className='[&_td]:px-6 [&_td]:py-4'>
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
                          <p className='text-small font-medium text-gray-900'>{item.name}</p>
                          <p className='text-small text-gray-500'>{item.email}</p>
                        </div>
                      </td>
                      <td>
                        <p className='text-small text-gray-700'>
                          {dayjs(item.createdAt).format('MMM DD, YYYY | hh:mm A')}
                        </p>
                      </td>
                      <td>
                        <p className='text-small rounded-xl bg-primary-50 px-3 py-[2px] text-center font-medium capitalize text-[#983504]'>
                          {item.role}
                        </p>
                      </td>
                      <td>
                        <button className='center-grid size-8 rounded-lg border border-gray-200'>
                          <DotsIcon />
                        </button>
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
