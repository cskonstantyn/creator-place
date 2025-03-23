import React from 'react';
import { CreditCurrency, UserCredit } from '@/types';

interface CreditBalanceProps {
  userCredit: UserCredit;
  currency: CreditCurrency;
  animateChange?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const CreditBalance: React.FC<CreditBalanceProps> = ({
  userCredit,
  currency,
  animateChange = true,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  // Sizing classes
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-1.5 px-3',
    lg: 'text-lg py-2 px-4',
  };
  
  // Symbol to display
  const symbol = currency.symbol || '🪙';
  
  return (
    <div className={`credit-balance-container inline-flex items-center ${className}`}>
      {showLabel && (
        <span className="mr-2 text-gray-600 font-medium">
          {currency.name}:
        </span>
      )}
      
      <div 
        className={`
          flex items-center rounded-full bg-primary-100 text-primary-800 font-medium
          ${sizeClasses[size]}
          ${animateChange ? 'transform transition-all duration-500' : ''}
        `}
        key={`${currency.id}-${userCredit.balance}`} // Key helps React animate changes
      >
        <span className="mr-1">{symbol}</span>
        <span 
          className={`${animateChange ? 'animate-fadeIn' : ''}`}
        >
          {userCredit.balance.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default CreditBalance; 