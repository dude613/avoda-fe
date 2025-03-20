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
            className={`${className}`}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {text}
            {iconRight && <span className="ml-2">{iconRight}</span>}

        </button>
    );
};
export default Button;
