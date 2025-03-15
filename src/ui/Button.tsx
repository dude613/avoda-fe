import React from "react";

interface ButtonProps {
    onClick?: () => void;
    text: string;
    className?: string;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, className, icon, iconRight, type, disabled=false }) => {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`bg-background text-sm text-text font-bold py-3 w-full rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-center ${className}`}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {text}
            {iconRight && <span className="ml-2">{iconRight}</span>}

        </button>
    );
};
export default Button;
