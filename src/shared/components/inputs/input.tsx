import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = ({ icon, className, ...props }: InputProps) => {
  return (
    <>
      {icon && (
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        className={`${className} px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-steel-blue-700 shadow-sm rounded`}
        {...props}
      />
    </>
  )
}