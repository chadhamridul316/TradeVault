import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-md bg-blue-500/10 animate-pulse" />
        <Loader2 className={`${sizes[size] || sizes.md} animate-spin text-blue-600 relative z-10`} />
      </div>
      {text && <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase font-mono">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

