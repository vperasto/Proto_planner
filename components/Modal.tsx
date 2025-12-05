import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white border-2 border-black shadow-neo relative flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b-2 border-black bg-white">
          <h2 className="text-xl font-bold uppercase tracking-wide text-ink">
            {title}
          </h2>
          <Button variant="icon" onClick={onClose} aria-label="Sulje">
            X
          </Button>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-grow bg-white">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t-2 border-black bg-zinc-50 flex justify-end gap-4">
          <Button label="SULJE" onClick={onClose} variant="secondary" />
        </div>
      </div>
    </div>
  );
};