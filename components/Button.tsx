import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
  label?: string; // Made optional for icon buttons
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  label, 
  className = '', 
  children,
  ...props 
}) => {
  const baseStyle = "font-mono font-bold uppercase text-sm border-2 border-black transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-none focus:outline-none flex items-center justify-center";
  
  const variants = {
    primary: "bg-white text-ink shadow-neo hover:bg-accent px-4 py-2",
    secondary: "bg-white text-ink shadow-neo border-black hover:bg-zinc-100 px-4 py-2",
    danger: "bg-white text-red-600 border-red-600 shadow-neo hover:bg-red-50 px-4 py-2",
    ghost: "border-none hover:bg-accent px-2 py-1 shadow-none active:translate-y-0 active:translate-x-0",
    icon: "bg-white text-ink shadow-neo hover:bg-accent w-10 h-10 p-0"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {label || children}
    </button>
  );
};