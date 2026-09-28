import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#0b1736] via-[#14295e] to-[#1e3a8a] text-white font-semibold shadow-[0_4px_14px_-2px_rgba(11,23,54,0.35)] hover:shadow-[0_6px_20px_-2px_rgba(30,58,138,0.45)] hover:brightness-105 border border-blue-900/30',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-sm backdrop-blur-md',
    aurora:
      'bg-gradient-to-r from-[#0b1736] via-[#1e3a8a] to-[#2563eb] text-white font-semibold shadow-[0_4px_14px_-2px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_-2px_rgba(37,99,235,0.45)] hover:brightness-105 border border-blue-500/30',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold shadow-[0_4px_14px_-2px_rgba(225,29,72,0.3)] hover:shadow-[0_6px_20px_-2px_rgba(225,29,72,0.45)] hover:brightness-105 border border-rose-500/20',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    outline:
      'bg-white border border-slate-300 text-slate-800 hover:text-blue-600 hover:bg-blue-50/50 hover:border-blue-400',
    buy:
      'bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-[0_4px_14px_-2px_rgba(5,150,105,0.35)] border border-emerald-500/30',
    sell:
      'bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-[0_4px_14px_-2px_rgba(225,29,72,0.35)] border border-rose-500/30',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
    xl: 'text-lg px-8 py-4 gap-3 font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;

