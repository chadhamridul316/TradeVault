import React from 'react';

export const LoadingSkeleton = ({
  className = '',
  count = 1,
  variant = 'card', // 'card', 'stat', 'table-row', 'text', 'chart'
}) => {
  const renderItem = (index) => {
    switch (variant) {
      case 'stat':
        return (
          <div
            key={index}
            className={`glass-card p-5 rounded-2xl animate-pulse space-y-3 ${className}`}
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-8 w-8 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-7 w-32 bg-slate-300 rounded" />
            <div className="h-3 w-24 bg-slate-200 rounded" />
          </div>
        );

      case 'chart':
        return (
          <div
            key={index}
            className={`glass-card p-6 rounded-2xl animate-pulse space-y-4 ${className}`}
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-slate-300 rounded" />
              <div className="h-4 w-20 bg-slate-200 rounded" />
            </div>
            <div className="h-64 bg-slate-100 rounded-xl border border-slate-200" />
          </div>
        );

      case 'table-row':
        return (
          <tr key={index} className="border-b border-slate-100 animate-pulse">
            <td className="py-4 px-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
            <td className="py-4 px-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
            <td className="py-4 px-4"><div className="h-4 w-12 bg-slate-200 rounded" /></td>
            <td className="py-4 px-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
            <td className="py-4 px-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
            <td className="py-4 px-4"><div className="h-4 w-12 bg-slate-200 rounded" /></td>
            <td className="py-4 px-4"><div className="h-4 w-12 bg-slate-200 rounded" /></td>
            <td className="py-4 px-4"><div className="h-4 w-10 bg-slate-200 rounded" /></td>
            <td className="py-4 px-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
            <td className="py-4 px-4"><div className="h-4 w-8 bg-slate-200 rounded" /></td>
            <td className="py-4 px-4 text-right"><div className="h-7 w-7 bg-slate-200 rounded-lg ml-auto" /></td>
          </tr>
        );

      case 'card':
      default:
        return (
          <div
            key={index}
            className={`glass-card p-6 rounded-2xl animate-pulse space-y-4 ${className}`}
          >
            <div className="h-5 w-1/3 bg-slate-300 rounded" />
            <div className="h-4 w-2/3 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded-xl" />
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => renderItem(i))}
    </>
  );
};

export default LoadingSkeleton;

