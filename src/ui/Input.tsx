import React from "react";

interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
    className?: string;
}

const Input: React.FC<InputProps> = ({ type = "text", placeholder, value, onChange, onKeyDown, error, disabled, className }) => {
    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                className={`border text-sm p-3 w-full rounded focus:outline-none ${className}`}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                disabled={disabled}
            />
            {error && <p className="text-red-500 text-xs mb-2 mt-2">{error}</p>}
        </div>
    );
};

export default Input;
