// src/store/confirmationStore.ts
import { create } from 'zustand';

// Define the options our confirmation dialog can accept
interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

// Define the state of our store
interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationOptions | null;
  // This will hold the 'resolve' function of the promise we return
  resolvePromise: ((value: boolean) => void) | null;
  // The function components will call to show the dialog
  show: (options: ConfirmationOptions) => Promise<boolean>;
  // Internal functions to handle user actions
  handleConfirm: () => void;
  handleCancel: () => void;
}

export const useConfirmationStore = create<ConfirmationState>((set, get) => ({
  isOpen: false,
  options: null,
  resolvePromise: null,

  show: (options: ConfirmationOptions) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        options,
        resolvePromise: resolve,
      });
    });
  },

  handleConfirm: () => {
    get().resolvePromise?.(true);
    set({ isOpen: false, options: null, resolvePromise: null });
  },

  handleCancel: () => {
    get().resolvePromise?.(false);
    set({ isOpen: false, options: null, resolvePromise: null });
  },
}));