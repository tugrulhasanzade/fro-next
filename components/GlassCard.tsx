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
      /* Light Mode: Solid White, Grey Border, Strong Shadow */
      bg-white
      border-2 
      border-slate-200
      shadow-xl
      shadow-slate-200/50
      
      /* Dark Mode: Deep transparency */
      dark:bg-slate-900/60 
      dark:border-white/10 
      dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)] 
      
      /* Glass Core */
      backdrop-blur-xl 
      backdrop-saturate-150
      rounded-[24px] 
      transition-all duration-300 ease-out
      
      ${hoverEffect ? 'hover:shadow-2xl hover:-translate-y-1 dark:hover:border-indigo-500/30' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};