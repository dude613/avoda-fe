import React from "react";
import { cn } from "@/lib/utils"; // Assuming this path is correct

//TODO Put all in the correct components folder
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Inherit standard div attributes
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    // Outer div for centering on the screen
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      {/* Inner div representing the actual card */}
      <div
        className={cn(
          "w-full max-w-sm rounded-lg border bg-card text-card-foreground shadow-sm p-6", // Simplified width, padding, and added standard card styles
          className // Merge incoming className
        )}
        {...props} // Spread remaining props onto the inner div
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
