import React from "react";

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ icon, className, ...props }, ref) => {
  return (
    <>
      {icon && (
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={`${className} px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-steel-blue-700 shadow-sm rounded`}
        {...props}
      />
    </>
  );
});

Input.displayName = 'Input';