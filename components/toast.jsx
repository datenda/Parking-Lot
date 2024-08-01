// ToastComponent.jsx

import React from "react";
import { toast } from "react-toastify";

export const showToast = (type, message) => {
  switch (type) {
    case "info":
      toast.info(message);
      break;
    case "warning":
      toast.warn(message);
      break;
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast(message);
      break;
  }
};

export const showPromiseToast = () => {
  const promise = new Promise((resolve, reject) => {
    // Simulating an asynchronous operation
    setTimeout(() => {
      const isSuccess = Math.random() < 0.5; // Randomly resolve or reject the promise
      if (isSuccess) {
        resolve("Promise resolved!");
      } else {
        reject(new Error("Promise rejected!"));
      }
    }, 2000);
  });

  toast.promise(promise, {
    pending: "Promise in progress...",
    success: "Promise resolved!",
    error: "Promise rejected!",
  });
};

// You can call these functions wherever you need to show the toasts

// Optionally, you can also define and export a functional component if needed
const ToastComponent = () => {
  return null; // or return an empty <div> if you want to render something
};

export default ToastComponent;
