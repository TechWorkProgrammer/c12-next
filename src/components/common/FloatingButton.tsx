import React, {FC} from 'react';

interface ButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

const FloatingButton: FC<ButtonProps> = ({onClick, disabled = false}) => {
    return (
        <div className="fixed end-6 bottom-6 group">
            <button
                onClick={onClick}
                disabled={disabled}
                className={`p-3 w-full text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors dark:bg-blue-800 dark:hover:bg-blue-700`}
            >
                <svg className="w-6 h-6 text-gray-300" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg" width="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M5 12h14m-7 7V5"/>
                </svg>
            </button>
        </div>
    );
};

export default FloatingButton;
