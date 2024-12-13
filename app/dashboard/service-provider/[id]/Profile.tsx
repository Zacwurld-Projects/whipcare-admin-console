import { ServiceProviderProfile } from '@/app/lib/mockTypes';
import DisplayInfo from '../../components/profile/DisplayInfo';
import DisplayAddress from '../../components/profile/DisplayAddress';
import LocationIcon from '../../assets/smallLocationIcon.svg';
import NairaIcon from '../../assets/NairaIcon.svg';
import ClockIcon from '../../assets/clockIcon.svg';
import Image from 'next/image';

const Profile = ({ profileInfo }: { profileInfo: ServiceProviderProfile }) => {
  const reflectStatusStyle = (status: string) => {
    switch (true) {
      case status === 'deactivated':
        return `bg-[#fbeae9] text-[#dd524d]`;
      case status === 'not verified':
        return `bg-primary-50 text-[#ff915b]`;
      case status === 'verified':
        return `bg-[#e7f6ec] text-[#40b869]`;
      default:
        return '';
    }
  };

  return (
    <article className=''>
      <div className='flex w-full gap-10'>
        <div className='flex-column w-[53%] gap-4 rounded-lg bg-gray-50 px-5 py-4'>
          <div className='mb-1 flex items-center justify-between'>
            <p className='text-large font-semibold text-gray-800'>Service Provider Info</p>
            <p
              className={`text-xsmall rounded-[6px] px-[6px] py-[2px] capitalize ${reflectStatusStyle(profileInfo.status)}`}
            >
              {profileInfo.status}
            </p>
          </div>
          {Object.entries(profileInfo.userInfo).map(([key, value]) => (
            <DisplayInfo title={key} value={value} key={key} />
          ))}
          <div className='flex-column gap-3'>
            <p className='text-large mb-1 font-semibold text-gray-800'>Address</p>
            {Object.entries(profileInfo.userAddress).map(([key, value]) => (
              <DisplayAddress key={key} title={key} value={value} />
            ))}
          </div>
        </div>
        <div className='flex-column flex-1 gap-5 rounded-lg bg-gray-50 px-4 py-5'>
          <div className='flex-column gap-4'>
            <p className='text-large mb-1 font-semibold text-gray-800'>Service Provided</p>
            <DisplayInfo title='Type of Service' value={profileInfo.servicesProvided.type} />
            <DisplayInfo title='Preferred Brand' value={profileInfo.servicesProvided.brand} />
          </div>
          <div>
            <p className='text-large mb-3 flex gap-1 font-semibold text-gray-800'>
              <span>List of Services </span>
              <span className='text-xsmall mt-1 font-medium text-primary-900'>
                ({profileInfo.servicesProvided.services.length})
              </span>
            </p>
            <ul className='flex-column gap-5'>
              {profileInfo.servicesProvided.services.map((item, index) => (
                <li key={index} className='flex items-start gap-6 px-5'>
                  <Image src={item.image} alt={item.type + ' image'} width={105} height={77} />
                  <div className='flex-column gap-2'>
                    <p className='text-xsmall font-medium capitalize text-primary-900'>
                      {item.type}
                    </p>
                    <p className='font-medium text-gray-800'>{item.title}</p>
                    <ul className='flex flex-wrap gap-2 [&_li]:flex [&_li]:items-center [&_li]:gap-[1px]'>
                      <li>
                        <LocationIcon />
                        <p className='text-xsmall font-medium text-gray-400'>{item.distance}</p>
                      </li>
                      <li>
                        <ClockIcon />
                        <p className='text-xsmall font-medium text-gray-400'>{item.time}</p>
                      </li>
                      <li>
                        <NairaIcon />
                        <p className='text-xsmall font-medium text-primary-900'>{item.price}</p>
                      </li>
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className='ml-auto mt-6 flex w-fit gap-4'>
        <button className='text-small w-fit self-end rounded-[32px] border border-[#cdc8c2] px-8 py-[10px] font-medium text-[#983504]'>
          Delete account
        </button>
        <button className='text-small w-fit self-end rounded-[32px] bg-[#983504] px-8 py-[10px] font-medium text-[#f9f8f7]'>
          Deactivate
        </button>
      </div>
    </article>
  );
};
export default Profile;
