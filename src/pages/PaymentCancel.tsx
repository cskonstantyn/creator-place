import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { AlertCircle } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8 glassmorphism p-8 rounded-xl">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-amber-500" />
            <h1 className="text-3xl font-bold">Payment Cancelled</h1>
            <p className="text-gray-400">
              Your payment has been cancelled. No charges were made.
            </p>
            
            <div className="flex flex-col space-y-4 w-full mt-4">
              <Button 
                onClick={() => navigate('/post-ad')}
                className="w-full"
                variant="default"
              >
                Try Again
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                className="w-full"
                variant="outline"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentCancel; 