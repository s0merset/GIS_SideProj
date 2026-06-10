import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-300/40",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 focus-visible:ring-2 focus-visible:ring-slate-500/40",
    outline: "border border-white/10 bg-transparent text-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-emerald-300/30",
    ghost: "text-slate-400 hover:text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={cn(
        "rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2",
        "hover:-translate-y-1 active:translate-y-0 disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};