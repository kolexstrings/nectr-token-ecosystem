'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyber' | 'neon' | 'electric' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'cyber', 
    size = 'md', 
    loading = false, 
    glow = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'relative overflow-hidden font-cyber font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      cyber: 'btn-cyber border-cyber-500 text-cyber-500 hover:border-cyber-400 hover:text-cyber-400 hover:shadow-cyber',
      neon: 'btn-neon border-neon-500 text-neon-500 hover:border-neon-400 hover:text-neon-400 hover:shadow-neon',
      electric: 'btn-electric border-electric-500 text-electric-500 hover:border-electric-400 hover:text-electric-400 hover:shadow-electric',
      ghost: 'border-transparent text-cyber-400 hover:bg-cyber-500/10 hover:text-cyber-300',
      glass: 'glass border-white/20 text-white hover:border-white/40 hover:bg-white/10',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-cyber',
      md: 'px-6 py-3 text-base rounded-cyber',
      lg: 'px-8 py-4 text-lg rounded-cyber',
      xl: 'px-10 py-5 text-xl rounded-cyber',
    };

    const glowClasses = glow ? 'animate-glow' : '';

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          glowClasses,
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              'loading-cyber',
              variant === 'neon' && 'loading-neon',
              variant === 'electric' && 'loading-electric'
            )} />
          </span>
        )}
        <span className={loading ? 'invisible' : 'visible'}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
