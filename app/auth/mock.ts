import { setCookie } from "cookies-next";

export const defaultInfo = {
  email: "whipcare@zacwurld.com",
  password: "Whipcare2024#",
  otp: "000000",
};

export const signUserIn = () => {
  // Set a cookie for the session after successful login
  setCookie("auth-token", "whipcare-test", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour expiration
  });
};
