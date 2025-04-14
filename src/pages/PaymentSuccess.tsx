import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  
  useEffect(() => {
    // Parse the query parameters
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    const productId = params.get('product');
    const credits = params.get('credits');
    
    // Log the parameters for debugging
    console.log('Payment success parameters:', { type, productId, credits });
    
    // Process the successful payment based on the type
    const processPayment = async () => {
      try {
        // In a real app, you would validate the payment with the server
        // For now, we'll simulate processing and store data in localStorage
        
        if (type === 'credit' && credits) {
          // Update credits in localStorage
          const currentCredits = localStorage.getItem('userCredits') ? 
            parseInt(localStorage.getItem('userCredits') || '0', 10) : 0;
          
          const newCredits = parseInt(credits, 10);
          localStorage.setItem('userCredits', (currentCredits + newCredits).toString());
          
          toast.success(`Added ${newCredits} credits to your account`);
        } else if (type === 'subscription') {
          // Store subscription info in localStorage
          localStorage.setItem('userSubscription', JSON.stringify({
            productId,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }));
          
          toast.success('Your subscription has been activated');
        } else if (type === 'one-time') {
          // Store one-time purchase info
          toast.success('Your purchase was successful');
        }
        
        // Set the processing status to false
        setIsProcessing(false);
      } catch (error) {
        console.error('Error processing payment success:', error);
        toast.error('There was an error processing your payment');
        setIsProcessing(false);
      }
    };
    
    // Only process if we have the required parameters
    if (type && productId) {
      processPayment();
    } else {
      setIsProcessing(false);
    }
  }, [location.search]);
  
  const handleContinue = () => {
    // Redirect to the appropriate page based on the payment type
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    
    if (type === 'credit' || type === 'one-time') {
      navigate('/post-ad');
    } else {
      navigate('/');
    }
  };
  
  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8 glassmorphism p-8 rounded-xl">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h1 className="text-3xl font-bold">Payment Successful!</h1>
            <p className="text-gray-400">
              Your payment has been processed successfully.
            </p>
            
            {isProcessing ? (
              <div className="animate-pulse">Processing your payment...</div>
            ) : (
              <Button 
                onClick={handleContinue} 
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-600"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess; 