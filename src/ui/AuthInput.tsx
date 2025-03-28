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
    showStrengthIndicator?: boolean; // Added prop
}
import { useId, useState, useMemo } from "react"; // Added useState, useMemo
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react"; // Added icons
import { Button } from "@/components/ui/button";

const AuthInput: React.FC<AuthInputProps> = ({
    type = "text",
    placeholder,
    value = "", // Default value needed for strength check
    onChange,
    onKeyDown,
    error,
    disabled,
    className,
    label,
    showStrengthIndicator = false, // Default to false
}) => {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false); // Focus state
    const [isVisible, setIsVisible] = useState<boolean>(false); // Visibility state

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

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
        // Adjusted text slightly for focus context
        if (score === 0 && value.length > 0) return "Weak password";
        if (score === 0) return ""; // Don't show text initially
        if (score <= 2) return "Weak password";
        if (score === 3) return "Medium password";
        return "Strong password";
    };
    // --- Strength Logic End ---


    return (
        <div> {/* Added outer div to contain input and strength meter */}
            <div className="group relative">
                <label
                    htmlFor={id}
                    className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
                    >
                    <span className="bg-background inline-flex px-2">
                        {label || placeholder} {/* Use label prop, fallback to original placeholder */}
                    </span>
                </label>
                <div> {/* Added div for input + toggle button */}
                    <Input
                        id={id}
                        type={type === 'password' && isVisible ? "text" : type} // Handle visibility toggle
                        placeholder=" " // Crucial for the animation
                        className={cn("w-full", type === 'password' && "pe-9", className)} // Add padding for eye icon
                        value={value}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        disabled={disabled}
                        onFocus={handleFocus} // Add focus handler
                        onBlur={handleBlur}   // Add blur handler
                        aria-describedby={showStrengthIndicator && type === 'password' ? `${id}-description` : undefined}
                    />
                    {/* Password Visibility Toggle */}
                    {type === 'password' && (
                        <button
                            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={toggleVisibility}
                            aria-label={isVisible ? "Hide password" : "Show password"}
                            aria-pressed={isVisible}
                            aria-controls={id}
                        >
                            {isVisible ? (
                                <EyeOffIcon size={16} aria-hidden="true" />
                            ) : (
                                <EyeIcon size={16} aria-hidden="true" />
                            )}
                        </button>
                    )}
                </div>
                {error && <p className="text-destructive text-xs mb-2 mt-2">{error}</p>}
            </div>

            {/* Conditionally Rendered Password Strength Indicator */}
            {type === 'password' && showStrengthIndicator && isFocused && (
                <div className="mt-2"> {/* Added margin top */}
                    {/* Progress Bar */}
                    <div
                        className="bg-border mt-1 mb-2 h-1 w-full overflow-hidden rounded-full" // Adjusted margins
                        role="progressbar"
                        aria-valuenow={strengthScore}
                        aria-valuemin={0}
                        aria-valuemax={4}
                        aria-label="Password strength"
                    >
                        <div
                            className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-300 ease-out`} // Shortened duration
                            style={{ width: `${(strengthScore / 4) * 100}%` }}
                        ></div>
                    </div>

                    {/* Strength Text & Requirements (only if password entered) */}
                    {value.length > 0 && (
                        <>
                            <p id={`${id}-description`} className="text-foreground mb-2 text-xs font-medium"> {/* Smaller text */}
                                {getStrengthText(strengthScore)}. Must contain:
                            </p>
                            <ul className="space-y-1" aria-label="Password requirements"> {/* Reduced spacing */}
                                {strength.map((req, index) => (
                                    <li key={index} className="flex items-center gap-1.5"> {/* Reduced gap */}
                                        {req.met ? (
                                            <CheckIcon size={14} className="text-emerald-500" aria-hidden="true" /> // Smaller icon
                                        ) : (
                                            <XIcon size={14} className="text-muted-foreground/80" aria-hidden="true" /> // Smaller icon
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
