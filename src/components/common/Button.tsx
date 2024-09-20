import React, { FC } from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

const Button: FC<ButtonProps> = ({ label, onClick, disabled = false, variant = 'primary' }) => {
    const baseStyles = 'px-4 py-2 w-full rounded-lg transition-colors';
    const primaryStyles = 'text-white bg-blue-600 hover:bg-blue-700';
    const secondaryStyles = 'text-black bg-gray-200 hover:bg-gray-300';
    const disabledStyles = 'disabled:bg-gray-400 disabled:cursor-not-allowed';

    const variantStyles = variant === 'secondary' ? secondaryStyles : primaryStyles;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${disabledStyles}`}
        >
            {label}
        </button>
    );
};

export default Button;
