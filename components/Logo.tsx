import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', href = '/' }) => {
  return (
    <Link href={href} className={`flex items-baseline group ${className}`}>
      {/* "turkwise" Text */}
      <span className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight lowercase transition-colors duration-300">
        turkwise
      </span>

      {/* Pulsing Indigo Dot */}
      <span className="text-3xl md:text-4xl font-display font-bold text-indigo-500 animate-pulse leading-none ml-0.5">
        .
      </span>
    </Link>
  );
};
