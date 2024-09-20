interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const ButtonPrimary = ({ label, ...props }: ButtonProps) => {
  return <button
    className="w-full px-4 py-2 text-white font-medium bg-steel-blue-700 hover:bg-steel-blue-800 active:bg-steel-blue-900 rounded duration-150"
    {...props}
  >
    {label}
  </button>
}
