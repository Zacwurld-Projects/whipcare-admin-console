import { ReactNode } from 'react';
import PageHeading from '../components/PageHeading';
import FeeedbackNav from './FeeedbackNav';

const FeedBackLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <PageHeading page='Feedbacks' pageFilters />
      <FeeedbackNav />
      {children}
    </>
  );
};
export default FeedBackLayout;
