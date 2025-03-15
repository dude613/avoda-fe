import React from "react";

interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
}
 
const Input: React.FC<InputProps> = ({ type = "text", placeholder, value, onChange, onKeyDown, error, disabled }) => {
    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                className="border text-xs p-3 w-full mb-2 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                disabled={disabled}
            />
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        </div>
    );
};

export default Input;
