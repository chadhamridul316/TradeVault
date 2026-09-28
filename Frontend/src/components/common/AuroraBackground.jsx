import React from 'react';

export const AuroraBackground = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-screen bg-[#f6f7f9] overflow-hidden text-slate-900 ${className}`}>
      {/* Background Organic Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-left subtle Sky/Navy ambient wash */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[650px] h-[650px] sm:w-[900px] sm:h-[900px] rounded-full opacity-60 blur-[130px] bg-gradient-to-br from-blue-100/70 via-indigo-50/40 to-transparent animate-ambient-drift"
          style={{ animationDuration: '24s' }}
        />
        {/* Top-right soft Slate/Blue ambient sheen */}
        <div
          className="absolute top-[5%] -right-[15%] w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] rounded-full opacity-50 blur-[140px] bg-gradient-to-bl from-slate-200/60 via-sky-50/30 to-transparent animate-ambient-drift"
          style={{ animationDuration: '28s', animationDelay: '-5s' }}
        />
        {/* Bottom-center subtle pearl glow */}
        <div
          className="absolute bottom-[-15%] left-[20%] w-[600px] h-[600px] rounded-full opacity-40 blur-[140px] bg-gradient-to-t from-blue-50/50 via-slate-100/40 to-transparent animate-ambient-drift"
          style={{ animationDuration: '32s', animationDelay: '-10s' }}
        />
        {/* Fine subtle blueprint grid texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px]" 
        />
      </div>

      {/* Main content layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AuroraBackground;
