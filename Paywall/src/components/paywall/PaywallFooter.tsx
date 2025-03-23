import React from 'react';

const PaywallFooter: React.FC = () => {
  return (
    <div className="paywall-footer mt-12 border-t pt-6 text-center text-sm text-gray-500">
      <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
        <div className="flex items-center justify-center">
          <span className="text-primary-500 mr-2">🔒</span>
          Secure Payments
        </div>
        
        <div className="flex items-center justify-center">
          <span className="text-primary-500 mr-2">ℹ️</span>
          24/7 Support
        </div>
        
        <div className="flex items-center justify-center">
          <span className="text-primary-500 mr-2">↩️</span>
          Easy Refunds
        </div>
      </div>
      
      <div className="mt-4">
        <p>
          By making a purchase, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500 underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500 underline">Privacy Policy</a>.
        </p>
        
        <p className="mt-2">
          Have questions? Contact our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500 underline">customer support</a>.
        </p>
      </div>
      
      <div className="flex justify-center mt-4 space-x-3">
        <span className="text-xl">💳</span>
        <span className="text-xl">🏦</span>
        <span className="text-xl">💸</span>
      </div>
    </div>
  );
};

export default PaywallFooter; 