import React, {FC} from 'react';

interface ModalProps {
    label?: string | null
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: FC<ModalProps> = ({label = null, isOpen, onClose, children}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div
                className="rounded-lg overflow-hidden shadow-xl max-w-screen-md border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                <div className="flex justify-between p-2 pt-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white w-full text-center">{label ? label : ''}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
