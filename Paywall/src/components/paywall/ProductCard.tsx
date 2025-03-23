import React from 'react';
import { Product, Price, ProductCardProps } from '@/types';

interface ExtendedProductCardProps extends ProductCardProps {
  formattedPrice: string;
}

const ProductCard: React.FC<ExtendedProductCardProps> = ({
  product,
  price,
  onPurchase,
  featured = false,
  formattedPrice,
}) => {
  return (
    <div 
      className={`
        product-card rounded-lg overflow-hidden shadow-md transition-all duration-300 
        ${featured ? 'border-2 border-primary-500 transform scale-105' : 'border border-gray-200'} 
        hover:shadow-lg hover:border-primary-300
      `}
    >
      {featured && (
        <div className="bg-primary-500 text-white py-1 px-2 text-center font-medium">
          Popular Choice
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
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-600">{formattedPrice}</span>
          <span className="text-sm text-gray-500">One-time payment</span>
        </div>
        
        <button 
          onClick={onPurchase}
          className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition duration-200 ease-in-out"
        >
          Buy Now
        </button>
        
        {product.metadata?.garantee && (
          <p className="text-xs text-center mt-3 text-gray-500">
            {product.metadata.garantee}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 