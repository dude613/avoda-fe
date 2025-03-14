import React, { useMemo } from "react";
import * as Constants from "@/constants/Register";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const calculateStrength = (password: string): number => {
    if (!password) return 0;

    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*]/.test(password)) score += 1;
    
    // Cap the score at 5
    return Math.min(5, score);
  };

  const { strengthLevel, strengthText, strengthColor } = useMemo(() => {
    const strength = calculateStrength(password);
    
    let text;
    let color;
    
    switch (strength) {
      case 0:
        text = Constants.PASSWORD_VERY_WEAK;
        color = "bg-gray-300";
        break;
      case 1:
        text = Constants.PASSWORD_VERY_WEAK;
        color = "bg-red-500";
        break;
      case 2:
        text = Constants.PASSWORD_WEAK;
        color = "bg-orange-500";
        break;
      case 3:
        text = Constants.PASSWORD_MEDIUM;
        color = "bg-yellow-500";
        break;
      case 4:
        text = Constants.PASSWORD_STRONG;
        color = "bg-blue-500";
        break;
      case 5:
        text = Constants.PASSWORD_VERY_STRONG;
        color = "bg-green-500";
        break;
      default:
        text = Constants.PASSWORD_VERY_WEAK;
        color = "bg-gray-300";
    }
    
    return {
      strengthLevel: strength,
      strengthText: text,
      strengthColor: color,
    };
  }, [password]);

  // Create an array of 5 segments for the strength meter
  const segments = Array(5).fill(0);

  return (
    <div className="mt-1 mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">
          {Constants.PASSWORD_STRENGTH_TEXT}
        </span>
        <span className="text-xs font-medium" style={{ color: strengthLevel > 0 ? strengthColor.replace('bg-', 'text-') : 'text-gray-600' }}>
          {strengthText}
        </span>
      </div>
      <div className="flex space-x-1">
        {segments.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full ${
              index < strengthLevel
                ? strengthColor
                : "bg-gray-200 border border-dashed border-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
