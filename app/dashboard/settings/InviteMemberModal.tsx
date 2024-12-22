'use client';

import { Dispatch, FormEvent } from 'react';
import DarkOverlay from '../components/DarkOverlay';
import ArrowLeftIcon from '../assets/arrowLeft.svg';
import InviteMembersForm from './InviteMembersForm';

const InviteMemberModal = ({
  setIsDisplayingInviteModal,
  memberDetails,
  setMemberDetails,
  onSubmit,
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
  setIsDisplayingInviteModal: Dispatch<boolean>;
}) => {
  return (
    <DarkOverlay className='center-grid'>
      <article
        className={`flex-column w-[434px] gap-7 rounded-lg bg-white px-6 py-8 min-[1100px]:ml-[248px]`}
      >
        <div className='flex items-center gap-20'>
          <button
            onClick={() => setIsDisplayingInviteModal(false)}
            className='center-grid size-8 rounded-full bg-gray-100'
          >
            <ArrowLeftIcon />
          </button>
          <h5 className='heading-h5 font-medium text-gray-800'>Invite Member</h5>
        </div>
        <InviteMembersForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          memberDetails={memberDetails}
          setMemberDetails={setMemberDetails}
        />
      </article>
    </DarkOverlay>
  );
};
export default InviteMemberModal;
