import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-neutral-900 rounded-xl shadow-lg p-8 max-w-lg w-full relative">
        <button
          className="absolute top-3 right-3 text-neutral-400 hover:text-custom-cyan text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {title && <h2 className="text-2xl font-bold mb-4 text-custom-cyan">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
