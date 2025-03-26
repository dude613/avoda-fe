interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
    className?: string;
    label?: string;
}

const Input: React.FC<InputProps> = ({ type = "text", placeholder, value, onChange, onKeyDown, error, disabled, className, label }) => {
    return (
        <div>
            {label && <label className="text-xs mb-2 block">{label}</label>} 
            <input
                type={type}
                placeholder={placeholder}
                className={`${className}`}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                disabled={disabled}
            />
            {error && <p className="text-destructive text-xs mb-2 mt-2">{error}</p>}
        </div>
    );
};

export default Input;
