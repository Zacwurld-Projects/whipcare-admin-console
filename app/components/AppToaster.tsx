"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontSize: "14px",
        },
        success: {
          style: {
            background: "#F0FDF4",
            color: "#166534",
          },
        },
        error: {
          style: {
            background: "#FEF2F2",
            color: "#B91C1C",
          },
        },
      }}
    />
  );
}
