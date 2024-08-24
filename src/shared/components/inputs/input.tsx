import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = ({ icon, ...props }: InputProps) => {
  return (
    <div className="relative max-w-xs">
      {icon && (
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        type="text"
        placeholder="Enter your email"
        className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
        {...props}
      />
    </div>
  )
}