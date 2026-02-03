// src/components/ConfirmationDialog.tsx
"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { useConfirmationStore } from '@/store/confirmationstore';

export const ConfirmationDialog = () => {
  const { isOpen, options, handleConfirm, handleCancel } = useConfirmationStore();

  if (!options) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleCancel}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-xl bg-black border border-neutral-800 p-6 shadow-lg z-50">
          <Dialog.Title className="text-lg font-bold text-white">
            {options.title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-neutral-400">
            {options.description}
          </Dialog.Description>
          
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-bold rounded-full border border-neutral-700 hover:bg-neutral-900"
            >
              {options.cancelText || 'Cancel'}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-bold rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {options.confirmText || 'Confirm'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};