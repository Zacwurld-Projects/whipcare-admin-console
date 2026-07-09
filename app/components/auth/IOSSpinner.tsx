"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const SPINNER_SRC = "/lotties/ios-loading-spinner.lottie";

type IOSSpinnerProps = {
  className?: string;
};

export function IOSSpinner({ className = "h-6 w-6 brightness-0 invert" }: IOSSpinnerProps) {
  return (
    <DotLottieReact
      src={SPINNER_SRC}
      loop
      autoplay
      className={className}
    />
  );
}
