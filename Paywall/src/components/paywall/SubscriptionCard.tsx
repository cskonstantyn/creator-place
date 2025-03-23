import React from 'react';
import { SubscriptionCardProps } from '@/types';

interface ExtendedSubscriptionCardProps extends SubscriptionCardProps {
  formattedPrice: string;
}

const SubscriptionCard: React.FC<ExtendedSubscriptionCardProps> = ({
  product,
  price,
  onSubscribe,
  featured = false,
  formattedPrice,
}) => {
  // Display information about trial if available
  const trialText = price.trial_period_days 
    ? `${price.trial_period_days}-day free trial` 
    : null;

  // Get interval text for display
  const getIntervalText = () => {
    const count = price.interval_count || 1;
    const interval = price.interval || 'month';
    
    if (count === 1) {
      return `Billed ${interval}ly`;
    } else {
      return `Billed every ${count} ${interval}s`;
    }
  };

  return (
    <div 
      className={`
        subscription-card rounded-lg overflow-hidden shadow-md transition-all duration-300 
        ${featured ? 'border-2 border-primary-500 transform scale-105' : 'border border-gray-200'} 
        hover:shadow-lg hover:border-primary-300
      `}
    >
      {featured && (
        <div className="bg-primary-500 text-white py-1 px-2 text-center font-medium">
          Recommended
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
        
        <div className="flex flex-col mb-4">
          <span className="text-2xl font-bold text-primary-600">{formattedPrice}</span>
          <span className="text-sm text-gray-500">{getIntervalText()}</span>
        </div>
        
        {trialText && (
          <div className="mb-4 bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {trialText}
          </div>
        )}
        
        <button 
          onClick={onSubscribe}
          className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition duration-200 ease-in-out"
        >
          {trialText ? 'Start Free Trial' : 'Subscribe Now'}
        </button>
        
        <p className="text-xs text-center mt-3 text-gray-500">
          Cancel anytime
        </p>
        
        {product.metadata?.features && (
          <div className="mt-4 border-t pt-4">
            <strong className="text-sm block mb-2">Includes:</strong>
            <ul className="text-sm text-gray-600 space-y-1">
              {product.metadata?.features.split(',').map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-4 w-4 text-green-500 mr-1 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8
  12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature.trim()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard; 