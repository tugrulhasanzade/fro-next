import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div className={`
      relative
      /* Light Mode: 
         CHANGED: bg-white/90 (90% Opacity) 
         REASON: Guarantees text readability by blocking background interference. 
      */
      bg-white/90 
      border-white/80 
      shadow-[0_8px_32px_rgba(0,0,0,0.08)]
      
      /* Dark Mode: Deep transparency */
      dark:bg-slate-900/60 
      dark:border-white/10 
      dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)] 
      
      /* Glass Core */
      backdrop-blur-xl 
      backdrop-saturate-150
      border
      rounded-[24px] 
      transition-all duration-300 ease-out
      
      ${hoverEffect ? 'hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 dark:hover:border-indigo-500/30' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};