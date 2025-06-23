/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { toast } from 'react-hot-toast';
import { ReactNode } from 'react';

export function confirmDialog({
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
}: {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    const toastId = toast((t) => (
      <div className="p-4 space-y-2 text-[#1A5E8D]">
        <p className="text-sm">{message}</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
             className="text-red-600 text-sm bg-red-100 px-3 py-1 rounded hover:bg-red-200"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  });
}
