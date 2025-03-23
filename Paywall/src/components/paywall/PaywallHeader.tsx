import React from 'react';

interface PaywallHeaderProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const PaywallHeader: React.FC<PaywallHeaderProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="paywall-header mb-8">
      <h2 className="text-2xl font-bold text-center mb-4">Choose Your Plan</h2>
      
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors 
              ${!selectedCategory 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
            onClick={() => onSelectCategory(null)}
          >
            All
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors 
                ${selectedCategory === category 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
              `}
              onClick={() => onSelectCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      <div className="text-center text-gray-600 max-w-2xl mx-auto">
        <p>
          Select the plan that best fits your needs. All plans include secure payment processing,
          access to customer support, and regular updates.
        </p>
      </div>
    </div>
  );
};

export default PaywallHeader; 