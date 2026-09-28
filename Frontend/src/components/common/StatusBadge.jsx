import React from 'react';
import { STATUS_CONFIG } from '../../utils/constants';

export const StatusBadge = ({ status = 'Not-Started', size = 'md', className = '' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Not-Started'];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold',
  }[size] || sizeClasses.md;

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size] || dotSizes.md;

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase font-mono ${config.bg} ${config.border} ${config.text} ${config.glow} ${sizeClasses} ${className}`}
    >
      <span className={`rounded-full ${config.dot} ${dotSizes} ${status === 'Active' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
