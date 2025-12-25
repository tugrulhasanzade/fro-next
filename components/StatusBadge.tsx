import React from 'react';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  text: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text }) => {
  const colors = {
    success: 'bg-green-500/20 text-green-300 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-300 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    neutral: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${colors[status]} backdrop-blur-sm`}>
      {text}
    </span>
  );
};