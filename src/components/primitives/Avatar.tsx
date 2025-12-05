import React from 'react';
import { getInitials } from '@/utils/task.utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className }) => {
  const sizeStyles = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };
  
  return (
    <div
      className={`bg-primary-500 rounded-full text-white flex items-center justify-center font-medium ${sizeStyles[size]} ${className || ''}`}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
};

