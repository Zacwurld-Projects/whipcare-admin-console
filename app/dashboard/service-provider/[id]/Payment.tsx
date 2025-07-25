import DisplayInfo from '../../components/profile/DisplayInfo';
import ArrowDownIcon from '../../assets/arrowDown.svg';
import SearchIcon from '../../assets/smallSearchIcon.svg';
import Filtericon from '../../assets/smallFilterIcon.svg';
import dayjs from 'dayjs';
import { PaymentInfo } from '@/app/lib/mockTypes';

const Payment = ({ paymentInfo }: { paymentInfo: PaymentInfo }) => {
  return (
    <article className='flex w-full gap-8'>
      <div className='flex-column w-[53%] gap-4 rounded-lg bg-white px-5 py-4'>
        <p className='text-large font-semibold text-gray-800'>Account Info</p>
        <div className='flex-column gap-6'>
          <DisplayInfo title='Account name' value={paymentInfo.accountName} />
          <DisplayInfo title='Account number' value={paymentInfo.accountNo} />
          <DisplayInfo title='Bank name' value={paymentInfo.bank} />
        </div>
      </div>
      <div className='flex-column flex-1 gap-4 rounded-lg bg-white p-4'>
        <div className='px-4 py-3'>
          <p className='text-large font-semibold text-gray-800'>Recent transactions</p>
        </div>
        <form action='' onSubmit={(e) => e.preventDefault()}>
          <label
            htmlFor='search'
            className='flex w-full items-center gap-3 rounded-2xl border border-gray-300 p-4'
          >
            <SearchIcon />
            <input
              type='text'
              id='search'
              name='search'
              placeholder='search'
              className='placeholder:text-small text-small w-full placeholder:text-[#98a2b3] focus:outline-none'
            />
            <Filtericon />
          </label>
        </form>
        <ul className='flex-column gap-6 px-5'>
          {paymentInfo.recentTransactions.map((item, index) => (
            <li key={index} className='flex items-center justify-between'>
              <div className='flex items-center gap-6'>
                <div className='center-grid size-10 rounded-full bg-[#e7f6ec]'>
                  <ArrowDownIcon />
                </div>
                <div className='flex-column gap-2'>
                  <p className='text-xsmall font-medium text-gray-900'>{item.title}</p>
                  <p className='text-xsmall text-[#2c3a4b]'>{item.type}</p>
                </div>
              </div>
              <div className='flex-column items-end gap-2'>
                <p className='text-[13px] font-medium text-gray-900'>
                  {item.amount.toPrecision(6)}
                </p>
                <p className='text-xsmall text-[#2c3a4b]'>
                  {dayjs(item.date).format('MMM DD | hh:mm A')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};
export default Payment;
