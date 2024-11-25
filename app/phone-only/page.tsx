"use client";

import { useEffect } from "react";

const PhoneOnly = () => {
  useEffect(() => {
    if (window)
      window.alert("This site can't be viewed from your mobile device.");
  }, []);

  return (
    <section className='center-grid h-[100vh] w-full'>
      <h3 className='heading-h3 font-semibold text-gray-800 font-inter'>
        This site can't be viewed on your mobile device 🫡
      </h3>
    </section>
  );
};
export default PhoneOnly;
