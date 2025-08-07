/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { toast } from 'react-hot-toast';

export function confirmDialog({
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  showInput = false,
  defaultValue = '',
}: {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showInput?: boolean;
  defaultValue?: string;
}): Promise<boolean | string> {
  return new Promise((resolve) => {
    let inputVal = defaultValue;

    const toastId = toast((t) => (
      <div className="p-4 space-y-2 text-[#1A5E8D]">
        <p className="text-sm">{message}</p>

        {showInput && (
          <input
            type="text"
            defaultValue={defaultValue}
            onChange={(e) => (inputVal = e.target.value)}
            className="w-full p-2 mt-2 border border-gray-300 rounded text-sm"
          />
        )}

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
              resolve(showInput ? inputVal : true);
            }}
            className="bg-[#1A5E8D] text-white text-sm px-3 py-1 rounded hover:bg-[#154a72]"
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