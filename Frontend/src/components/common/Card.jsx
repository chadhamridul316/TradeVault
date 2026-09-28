import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  glow = false,
  glowColor = 'cyan', // cyan, emerald, purple, red
  padding = 'p-6',
  header,
  footer,
  ...props
}) => {
  const glowClasses = {
    cyan: 'border-blue-300 shadow-[0_8px_25px_-5px_rgba(37,99,235,0.12)]',
    emerald: 'border-emerald-300 shadow-[0_8px_25px_-5px_rgba(5,150,105,0.12)]',
    purple: 'border-indigo-300 shadow-[0_8px_25px_-5px_rgba(99,102,241,0.12)]',
    red: 'border-rose-300 shadow-[0_8px_25px_-5px_rgba(225,29,72,0.12)]',
  };

  return (
    <div
      className={`glass-card rounded-2xl relative overflow-hidden transition-all duration-300 ${
        hover ? 'glass-card-hover' : ''
      } ${glow ? glowClasses[glowColor] || glowClasses.cyan : ''} ${className}`}
      {...props}
    >
      {/* Subtle top ambient sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/15 to-transparent pointer-events-none" />

      {header && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          {header}
        </div>
      )}

      <div className={padding}>{children}</div>

      {footer && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

