import React from 'react';

interface ButtonProps {
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    children: React.ReactNode;
    onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    children,
    onClick,
}) => {
    return (
        <button
            className={`button ${variant} ${size}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
