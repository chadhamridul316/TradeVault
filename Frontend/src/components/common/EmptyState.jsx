import React from 'react';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Data Found',
  description = 'There is currently no data to display for this view.',
  actionText,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div
      className={`glass-card rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center border border-slate-200/80 shadow-sm ${className}`}
    >
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mb-4 shadow-sm">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-mono mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
        {description}
      </p>

      {actionText && onAction && (
        <Button variant="aurora" size="md" onClick={onAction} leftIcon={actionIcon}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

