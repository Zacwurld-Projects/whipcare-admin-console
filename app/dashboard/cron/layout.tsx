import { ReactNode } from 'react';
import CronProvider from './CronContext';

const layout = ({ children }: { children: ReactNode }) => {
  return <CronProvider>{children}</CronProvider>;
};
export default layout;
