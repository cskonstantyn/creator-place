import React, { useState } from 'react';
import { Product, Price, PaymentType, PaywallProps } from '@/types';
import { usePaywall } from '@/hooks/usePaywall';
import ProductCard from './paywall/ProductCard';
import SubscriptionCard from './paywall/SubscriptionCard';
import CreditCard from './paywall/CreditCard';
import PaywallHeader from './paywall/PaywallHeader';
import PaywallFooter from './paywall/PaywallFooter';

const Paywall: React.FC<PaywallProps> = ({
  products,
  prices,
  onPurchase,
  onSubscribe,
  onCreditPurchase,
  className = '',
  showHeader = true,
  showFooter = true,
  theme = 'light',
  layout = 'cards',
  featuredPriceId,
  customComponents,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { formatPrice } = usePaywall();

  // Group products by category from metadata
  const productsByCategory: Record<string, Product[]> = {};
  products.forEach(product => {
    const category = product.metadata?.category || 'default';
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(product);
  });

  // Get categories
  const categories = Object.keys(productsByCategory);

  // Filter products by selected category or show all if none selected
  const filteredProducts = selectedCategory 
    ? productsByCategory[selectedCategory] 
    : products;

  // Render the appropriate card based on price type
  const renderPriceCard = (product: Product, price: Price) => {
    const isFeatured = price.id === featuredPriceId;

    switch (price.type) {
      case PaymentType.ONE_TIME:
        if (customComponents?.ProductCard) {
          const CustomProductCard = customComponents.ProductCard;
          return (
            <CustomProductCard
              key={price.id}
              product={product}
              price={price}
              onPurchase={() => onPurchase?.(price)}
              featured={isFeatured}
            />
          );
        }
        return (
          <ProductCard
            key={price.id}
            product={product}
            price={price}
            onPurchase={() => onPurchase?.(price)}
            featured={isFeatured}
            formattedPrice={formatPrice(price)}
          />
        );
      
      case PaymentType.SUBSCRIPTION:
        if (customComponents?.SubscriptionCard) {
          const CustomSubscriptionCard = customComponents.SubscriptionCard;
          return (
            <CustomSubscriptionCard
              key={price.id}
              product={product}
              price={price}
              onSubscribe={() => onSubscribe?.(price)}
              featured={isFeatured}
            />
          );
        }
        return (
          <SubscriptionCard
            key={price.id}
            product={product}
            price={price}
            onSubscribe={() => onSubscribe?.(price)}
            featured={isFeatured}
            formattedPrice={formatPrice(price)}
          />
        );
      
      case PaymentType.CREDIT:
        if (customComponents?.CreditCard) {
          const CustomCreditCard = customComponents.CreditCard;
          return (
            <CustomCreditCard
              key={price.id}
              product={product}
              price={price}
              onPurchase={(credits: number) => onCreditPurchase?.(price, credits)}
              featured={isFeatured}
            />
          );
        }
        return (
          <CreditCard
            key={price.id}
            product={product}
            price={price}
            onPurchase={(credits: number) => onCreditPurchase?.(price, credits)}
            featured={isFeatured}
            formattedPrice={formatPrice(price)}
          />
        );
      
      default:
        return null;
    }
  };

  const renderHeader = () => {
    if (!showHeader) return null;
    
    if (customComponents?.Header) {
      const CustomHeader = customComponents.Header;
      return <CustomHeader />;
    }
    
    return (
      <PaywallHeader 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    );
  };

  const renderFooter = () => {
    if (!showFooter) return null;
    
    if (customComponents?.Footer) {
      const CustomFooter = customComponents.Footer;
      return <CustomFooter />;
    }
    
    return <PaywallFooter />;
  };

  const layoutClasses = {
    cards: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    list: 'flex flex-col space-y-4',
    compact: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  };

  return (
    <div 
      className={`paywall-container ${className}`}
      data-theme={theme}
    >
      {renderHeader()}
      
      <div className={layoutClasses[layout]}>
        {filteredProducts.map(product => {
          // Find prices for this product
          const productPrices = prices.filter(price => price.product_id === product.id);
          
          // Render a card for each price
          return productPrices.map(price => renderPriceCard(product, price));
        })}
      </div>
      
      {renderFooter()}
    </div>
  );
};

export default Paywall; 