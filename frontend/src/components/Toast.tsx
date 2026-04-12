"use client";

import { Toaster as SonnerToaster } from "sonner";
import { toast as sonnerToast } from "sonner";

export type { ToasterProps as SonnerProps } from "sonner";

function ToastContainer(props: any) {
  return (
    <SonnerToaster
      theme="light"
      position="top-center"
      expand={false}
      richColors
      {...props}
    />
  );
}

export default ToastContainer;

export const toast = sonnerToast;