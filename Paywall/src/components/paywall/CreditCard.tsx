import React, { useState } from 'react';
import { CreditCardProps } from '@/types';

interface ExtendedCreditCardProps extends CreditCardProps {
  formattedPrice: string;
}

const CreditCard: React.FC<ExtendedCreditCardProps> = ({
  product,
  price,
  onPurchase,
  featured = false,
  formattedPrice,
}) => {
  // Default credit amount from metadata or 1
  const defaultAmount = Number(price.metadata?.defaultAmount || '1');
  const [creditAmount, setCreditAmount] = useState(defaultAmount);
  
  // Get credit currency info from metadata
  const currencySymbol = price.metadata?.currencySymbol || '🪙';
  const currencyName = price.metadata?.currencyName || 'Credits';
  
  // Calculate total price
  const totalPrice = (price.unit_amount * creditAmount) / 100;
  const formattedTotalPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency.toUpperCase(),
  }).format(totalPrice);
  
  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setCreditAmount(value);
    }
  };
  
  // Prepare bonus display if applicable
  const bonusInfo = creditAmount >= 10 
    ? { text: `+${Math.floor(creditAmount * 0.1)} Bonus ${currencyName}!`, className: 'text-green-600' }
    : creditAmount >= 5 
      ? { text: `+${Math.floor(creditAmount * 0.05)} Bonus ${currencyName}!`, className: 'text-green-600' } 
      : null;

  return (
    <div 
      className={`
        credit-card rounded-lg overflow-hidden shadow-md transition-all duration-300 
        ${featured ? 'border-2 border-primary-500 transform scale-105' : 'border border-gray-200'} 
        hover:shadow-lg hover:border-primary-300
      `}
    >
      {featured && (
        <div className="bg-primary-500 text-white py-1 px-2 text-center font-medium">
          Best Value
        </div>
      )}
      
      {product.image && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Per Credit:</span>
            <span className="text-lg font-medium text-primary-600">{formattedPrice}</span>
          </div>
          
          <div className="mt-3">
            <label htmlFor="creditAmount" className="block text-sm text-gray-600 mb-1">
              How many {currencyName} do you want?
            </label>
            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => creditAmount > 1 && setCreditAmount(creditAmount - 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 h-9 w-9 rounded-l-md flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                id="creditAmount"
                min="1"
                value={creditAmount}
                onChange={handleAmountChange}
                className="border border-gray-300 h-9 px-3 text-center w-16 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button 
                type="button"
                onClick={() => setCreditAmount(creditAmount + 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 h-9 w-9 rounded-r-md flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          
          {bonusInfo && (
            <div className={`mt-2 text-sm ${bonusInfo.className} font-medium animate-pulse`}>
              {bonusInfo.text}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4 border-t border-gray-200 pt-3">
          <span className="text-sm font-medium">Total:</span>
          <span className="text-2xl font-bold text-primary-600">{formattedTotalPrice}</span>
        </div>
        
        <button 
          onClick={() => onPurchase(creditAmount)}
          className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition duration-200 ease-in-out flex items-center justify-center"
        >
          <span className="mr-1">{currencySymbol}</span>
          Purchase {currencyName}
        </button>
        
        <p className="text-xs text-center mt-3 text-gray-500">
          Credits never expire
        </p>
      </div>
    </div>
  );
};

export default CreditCard; 