import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const base = 'bg-paper border border-sand rounded-xl p-4';
  const hoverClass = hover ? 'cursor-pointer hover:border-gold hover:shadow-md transition-all duration-200' : '';

  if (onClick || hover) {
    return (
      <motion.div
        whileHover={hover ? { y: -2, boxShadow: '0 4px 20px rgba(184,151,90,0.15)' } : {}}
        onClick={onClick}
        className={`${base} ${hoverClass} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${base} ${className}`}>
      {children}
    </div>
  );
}
