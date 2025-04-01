interface AuthInputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
    className?: string;
    label?: string;
    showStrengthIndicator?: boolean;
}
// Import useEffect
import { useId, useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";

const AuthInput: React.FC<AuthInputProps> = ({
    type = "text",
    placeholder,
    value = "",
    onChange,
    onKeyDown,
    error, // The error prop from react-hook-form
    disabled,
    className,
    label,
    showStrengthIndicator = false,
}) => {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // Renamed for clarity

    // State for managing the displayed error and its fade-out
    const [displayError, setDisplayError] = useState<string | undefined>(undefined);
    const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);

    // Effect to handle error display and fade-out
    useEffect(() => {
        let fadeTimer: NodeJS.Timeout;
        let clearTimer: NodeJS.Timeout;

        if (error) {
            setDisplayError(error); // Set the error message to display
            setIsErrorVisible(true); // Make it visible immediately

            // Start timer to initiate fade-out after 1 second
            fadeTimer = setTimeout(() => {
                setIsErrorVisible(false); // Start fading out
            }, 2000); // 2 second delay

            // Start timer to clear the error message after fade-out completes (adjust duration if needed)
            clearTimer = setTimeout(() => {
                setDisplayError(undefined); // Clear the error message content
            }, 2400); // 2000ms delay + 400ms fade duration

        } else {
            // If the error prop becomes undefined (e.g., user corrects input), hide immediately
            setIsErrorVisible(false);
            setDisplayError(undefined);
        }

        // Cleanup function to clear timers if the component unmounts or the error changes
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(clearTimer);
        };
    }, [error]); // Rerun effect when the error prop changes

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const toggleVisibility = () => setIsPasswordVisible((prevState) => !prevState);

    // --- Strength Logic Start ---
    const checkStrength = (pass: string) => {
        const requirements = [
            { regex: /.{8,}/, text: "At least 8 characters" },
            { regex: /[0-9]/, text: "At least 1 number" },
            { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "At least 1 special character" },
            { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
        ];
        return requirements.map((req) => ({
            met: req.regex.test(pass),
            text: req.text,
        }));
    };

    const strength = useMemo(() => checkStrength(value), [value]);

    const strengthScore = useMemo(() => {
        return strength.filter((req) => req.met).length;
    }, [strength]);

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border";
        if (score <= 1) return "bg-red-500";
        if (score <= 2) return "bg-orange-500";
        if (score === 3) return "bg-amber-500";
        return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
        if (score === 0 && value.length > 0) return "Weak password";
        if (score === 0) return "";
        if (score <= 2) return "Weak password";
        if (score === 3) return "Medium password";
        return "Strong password";
    };
    // --- Strength Logic End ---


    return (
        <div>
            <div className="group relative">
                <label
                    htmlFor={id}
                    className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
                    >
                    <span className="bg-background inline-flex px-2">
                        {label || placeholder}
                    </span>
                </label>
                <div>
                    <Input
                        id={id}
                        type={type === 'password' && isPasswordVisible ? "text" : type}
                        placeholder=" "
                        className={cn("w-full", type === 'password' && "pe-9", className)}
                        value={value}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        disabled={disabled}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        aria-describedby={showStrengthIndicator && type === 'password' ? `${id}-description` : undefined}
                    />
                    {type === 'password' && (
                        <button
                            type="button"
                            className="text-muted-foreground/80 hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={toggleVisibility}
                            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                            aria-pressed={isPasswordVisible}
                            aria-controls={id}
                        >
                            {isPasswordVisible ? (
                                <EyeOffIcon size={16} aria-hidden="true" />
                            ) : (
                                <EyeIcon size={16} aria-hidden="true" />
                            )}
                        </button>
                    )}
                </div>
                {/* Error Message with Fade-out */}
                {displayError && (
                    <p className={cn(
                        "text-destructive text-xs mb-2 mt-2 transition-opacity duration-300 ease-out",
                        isErrorVisible ? "opacity-100" : "opacity-0"
                    )}>
                        {displayError}
                    </p>
                )}
            </div>

            {/* Conditionally Rendered Password Strength Indicator */}
            {type === 'password' && showStrengthIndicator && isFocused && (
                 <div className="mt-2">
                    <div
                        className="bg-border mt-1 mb-2 h-1 w-full overflow-hidden rounded-full"
                        role="progressbar"
                        aria-valuenow={strengthScore}
                        aria-valuemin={0}
                        aria-valuemax={4}
                        aria-label="Password strength"
                    >
                        <div
                            className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-300 ease-out`}
                            style={{ width: `${(strengthScore / 4) * 100}%` }}
                        ></div>
                    </div>
                    {value.length > 0 && (
                        <>
                            <p id={`${id}-description`} className="text-foreground mb-2 text-xs font-medium">
                                {getStrengthText(strengthScore)}. Must contain:
                            </p>
                            <ul className="space-y-1" aria-label="Password requirements">
                                {strength.map((req, index) => (
                                    <li key={index} className="flex items-center gap-1.5">
                                        {req.met ? (
                                            <CheckIcon size={14} className="text-emerald-500" aria-hidden="true" />
                                        ) : (
                                            <XIcon size={14} className="text-muted-foreground/80" aria-hidden="true" />
                                        )}
                                        <span className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}>
                                            {req.text}
                                            <span className="sr-only">
                                                {req.met ? " - Requirement met" : " - Requirement not met"}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AuthInput;
