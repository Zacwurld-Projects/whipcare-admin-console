'use client';

import { ChangeEvent, useState } from 'react';
import EyeIcon from '../assets/eyeIcon.svg';
import EyeSlash from '../assets/eyeSlash.svg';

const InputArea = ({
  value,
  defaultValue,
  type,
  name,
  title,
  readOnly,
  handleChange,
}: {
  defaultValue?: string;
  readOnly?: boolean;
  value: string;
  type: 'email' | 'password' | 'text';
  name: string;
  title: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isViewingPassword, setIsViewingPassword] = useState(false);

  return (
    <label
      htmlFor={name}
      className='grid h-[54px] w-full items-center rounded-[5px] border border-gray-200'
    >
      <div className='relative flex w-[92%] items-center gap-2 justify-self-center'>
        <input
          type={type === 'password' ? (isViewingPassword ? 'text' : 'password') : type}
          name={name}
          required
          readOnly={readOnly || false}
          id={name}
          defaultValue={defaultValue}
          value={value}
          onChange={handleChange}
          className={`text-small peer flex-1 text-gray-700 focus:mt-3 focus:outline-none ${
            value ? 'mt-3' : ''
          }`}
        />
        <p
          className={`peer-focus:text-xsmall pointer-events-none absolute top-1/2 -translate-y-1/2 justify-self-start text-gray-800 opacity-50 transition-all peer-focus:translate-y-[-110%] peer-focus:font-medium ${
            value ? 'text-xsmall translate-y-[-110%] font-medium' : 'text-small'
          }`}
        >
          {title}
        </p>
        {type === 'password' && (
          <button
            className=''
            type='button'
            onClick={() => {
              setIsViewingPassword(!isViewingPassword);
            }}
          >
            {isViewingPassword ? <EyeSlash /> : <EyeIcon />}
          </button>
        )}
      </div>
    </label>
  );
};
export default InputArea;
