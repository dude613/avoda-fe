import React from "react";

interface ButtonProps {
    onClick?: () => void;
    text: string;
    className?: string;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, className, icon }) => {
    return (
        <button
            onClick={onClick}
            className={`bg-background text-sm text-text font-bold py-3 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center ${className}`}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {text}
        </button>
    );
};
export default Button;
