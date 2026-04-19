import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-sm font-sans tracking-widest transition-colors uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-gold)] disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-[var(--color-gold)] text-black hover:bg-[var(--color-gold-hover)] shadow-[0_0_15px_rgba(201,169,110,0.3)]": variant === 'primary',
                        "border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10": variant === 'outline',
                        "hover:bg-[#111] text-[#ededed]": variant === 'ghost',
                        "h-10 px-6 text-xs": size === 'sm',
                        "h-14 px-10 text-sm": size === 'md',
                        "h-16 px-12 text-base": size === 'lg',
                    },
                    className
                )}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);
Button.displayName = "Button";
