"use client";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

const FormButton = ({
  disabled,
  type,
  text,
  linkTo,
}: {
  disabled?: boolean;
  type: "submit" | "reset" | "button" | "link" | undefined;
  text: string;
  linkTo?: Url;
}) => {
  if (type === "link" && linkTo) {
    return (
      <Link
        className='bg-primary-900 rounded-[2em] center-grid h-[51px] w-full text-white block'
        href={linkTo}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      className='bg-primary-900 rounded-[2em] center-grid h-[51px] w-full text-white disabled:opacity-50 transition-opacity'
      type={type !== "link" ? type : "button"}
    >
      <p>{text}</p>
    </button>
  );
};
export default FormButton;
