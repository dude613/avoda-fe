import React, { useMemo } from "react";
import * as Constants from "@/constants/auth";

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
    
    // Character type checks
    if (/[A-Z]/.test(password)) score += 0.5;
    if (/[a-z]/.test(password)) score += 0.5;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*]/.test(password)) score += 2;

    // admin / password / 1234 - minus 1 point
    if (password.toLowerCase().includes("admin")) score -= 1;
    if (password.toLowerCase().includes("password")) score -= 1;
    if (password.toLowerCase().includes("1234")) score -= 1;

    
    // Cap the score at 5
    return Math.min(5, Math.max(0, score));
  };

const levels = [
  { level: 0, text: "Very Weak", color: "bg-red-400" },
  { level: 1, text: "Weak", color: "bg-red-300" },
  { level: 2, text: "Weak", color: "bg-orange-500" },
  { level: 3, text: "Medium", color: "bg-yellow-500" },
  { level: 4, text: "Strong", color: "bg-green-200" },
  { level: 5, text: "Very Strong", color: "bg-green-400" },
];

  const { strengthLevel, strengthText, strengthColor } = useMemo(() => {
    const strength = calculateStrength(password);
    
    let text;
    let color;
    
    switch (strength) {
      case 0:
        text = levels[0].text;
        color = levels[0].color;
        break;
      case 1:
        text = levels[1].text;
        color = levels[1].color;
        break;
      case 2:
        text = levels[2].text;
        color = levels[2].color;
        break;
      case 3:
        text = levels[3].text;
        color = levels[3].color;
        break;
      case 4:
        text = levels[4].text;
        color = levels[4].color;
        break;
      case 5:
        text = levels[5].text;
        color = levels[5].color;
        break;
      default:
        text = levels[0].text;
        color = levels[0].color;
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
        {/* TODO Add Text Below
        <span className="text-xs text-gray-600">
        </span>
        */}
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
