import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
    return (
        <div className={`flex items-center justify-center min-h-screen bg-card px-4 ${className}`}>
            <div className="pt-4 pl-8 pr-6 pb-2 rounded-lg shadow-lg border border-gray-300 w-auto sm:w-96 md:w-1/3 lg:w-1/4 xl:min-w-1/3 h-auto">
                <div className="border border-border rounded-lg p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Card;
