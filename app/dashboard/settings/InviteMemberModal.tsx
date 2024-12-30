'use client';

import { Dispatch, FormEvent } from 'react';
import InviteMembersForm from './InviteMembersForm';
import CenterModalContainer from '../components/modals/CenterModalContainer';

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
    <CenterModalContainer onClick={() => setIsDisplayingInviteModal(false)} title='Invite Member'>
      <InviteMembersForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        memberDetails={memberDetails}
        setMemberDetails={setMemberDetails}
      />
    </CenterModalContainer>
  );
};
export default InviteMemberModal;
