import { X } from '@phosphor-icons/react';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  content: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, content, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      tabIndex={-1}
      className="fixed shadown top-0 right-0 left-0 z-50 w-full h-full max-h-full overflow-y-auto overflow-x-hidden flex justify-center items-center bg-gray-900 bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={onClose}
          >
            <X size={24} />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
