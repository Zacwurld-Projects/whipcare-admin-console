"use client";

import { ChangeEvent, useState } from "react";
import EyeIcon from "../assets/eyeIcon.svg";
import EyeSlash from "../assets/eyeSlash.svg";

const InputArea = ({
  value,
  type,
  name,
  title,
  handleChange,
}: {
  value: string;
  type: "email" | "password" | "text";
  name: string;
  title: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isViewingPassword, setIsViewingPassword] = useState(false);

  return (
    <label
      htmlFor={name}
      className='border w-full h-[54px] border-gray-200 rounded-[5px] grid items-center'
    >
      <div className='w-[92%] relative justify-self-center flex items-center gap-2'>
        <input
          type={
            type === "password"
              ? isViewingPassword
                ? "text"
                : "password"
              : type
          }
          name={name}
          required
          id={name}
          value={value}
          onChange={handleChange}
          className={`focus:outline-none peer flex-1 text-small text-gray-700 focus:mt-3  ${
            value ? "mt-3" : ""
          }`}
        />
        <p
          className={`absolute top-1/2 -translate-y-1/2 justify-self-start text-gray-800 opacity-50 pointer-events-none peer-focus:text-xsmall peer-focus:font-medium peer-focus:translate-y-[-110%] transition-all ${
            value ? "text-xsmall font-medium translate-y-[-110%]" : "text-small"
          }`}
        >
          {title}
        </p>
        {type === "password" && (
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
