import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CreditCard, Apple, Lock, CheckCircle, ArrowRight, Percent, Handshake } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PaymentPlan, createPaymentIntent, processPayment } from "../../services/paymentService";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";

interface PaymentFormProps {
  selectedPlan: PaymentPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tabType?: 'discount' | 'brand-deal';
}

export function PaymentForm({ 
  selectedPlan, 
  isOpen, 
  onClose, 
  onSuccess,
  tabType
}: PaymentFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple'>('card');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Reset form when opening/closing
  useEffect(() => {
    if (!isOpen) {
      // Reset all form state when the form is closed
      setCardNumber("");
      setCardName("");
      setExpiryDate("");
      setCvv("");
      setLoading(false);
      
      // Also reset payment completion state when the form is completely closed
      // This ensures a fresh state for subsequent purchases
      if (paymentCompleted) {
        setPaymentCompleted(false);
      }
    }
  }, [isOpen, paymentCompleted]);
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces every 4 digits
    const value = e.target.value.replace(/\s/g, "");
    const formattedValue = value
      .replace(/[^\d]/g, "")
      .substring(0, 16)
      .match(/.{1,4}/g)
      ?.join(" ") || "";
    
    setCardNumber(formattedValue);
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry date as MM/YY
    const value = e.target.value.replace(/\//g, "");
    const formattedValue = value
      .replace(/[^\d]/g, "")
      .substring(0, 4);
    
    if (formattedValue.length > 2) {
      setExpiryDate(`${formattedValue.substring(0, 2)}/${formattedValue.substring(2)}`);
    } else {
      setExpiryDate(formattedValue);
    }
  };
  
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow 3-4 digits for CVV
    const value = e.target.value.replace(/[^\d]/g, "").substring(0, 4);
    setCvv(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }
    
    // Validate card details if using card payment
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error("Please fill in all card details");
        return;
      }
      
      if (cardNumber.replace(/\s/g, "").length < 16) {
        toast.error("Please enter a valid card number");
        return;
      }
      
      if (expiryDate.length < 5) {
        toast.error("Please enter a valid expiry date");
        return;
      }
      
      if (cvv.length < 3) {
        toast.error("Please enter a valid CVV");
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Check if using mock data
      const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
      
      if (useMockData) {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate storing the transaction in local storage for demo purposes
        const currentCredits = localStorage.getItem('userCredits') ? 
          parseInt(localStorage.getItem('userCredits') || '0', 10) : 0;
        
        if (selectedPlan.type === 'credit' && selectedPlan.credit_amount) {
          localStorage.setItem('userCredits', (currentCredits + selectedPlan.credit_amount).toString());
          localStorage.setItem('lastPurchasedCredits', selectedPlan.credit_amount.toString());
        } else if (selectedPlan.type === 'subscription') {
          localStorage.setItem('userSubscription', JSON.stringify({
            plan: selectedPlan.name,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }));
        }
      } else {
        // Get user ID from local storage or auth
        const userId = localStorage.getItem('userId') || 'guest';
        
        // Create a payment intent first
        const paymentIntent = await createPaymentIntent(
          userId,
          selectedPlan.id
        );
        
        if (!paymentIntent) {
          throw new Error("Failed to create payment intent");
        }
        
        // Process the payment with the created intent
        const result = await processPayment(
          paymentIntent.id,
          paymentMethod === 'apple' ? 'apple_pay' : 'card',
          paymentMethod === 'card' ? {
            number: cardNumber.replace(/\s/g, ""),
            expMonth: parseInt(expiryDate.split('/')[0], 10),
            expYear: parseInt(`20${expiryDate.split('/')[1]}`, 10),
            cvc: cvv
          } : undefined
        );
        
        if (!result.success) {
          throw new Error(result.message || "Payment processing failed");
        }
        
        // Store transaction data after successful payment
        if (selectedPlan.type === 'credit' && selectedPlan.credit_amount) {
          const currentCredits = localStorage.getItem('userCredits') ? 
            parseInt(localStorage.getItem('userCredits') || '0', 10) : 0;
          localStorage.setItem('userCredits', (currentCredits + selectedPlan.credit_amount).toString());
          localStorage.setItem('lastPurchasedCredits', selectedPlan.credit_amount.toString());
        } else if (selectedPlan.type === 'subscription') {
          localStorage.setItem('userSubscription', JSON.stringify({
            plan: selectedPlan.name,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }));
        }
      }
      
      // Mark payment as completed
      setPaymentCompleted(true);
      toast.success("Payment successful!");
      
      // Don't call onSuccess() here to show the success message first
      
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleContinueAfterPayment = () => {
    // Call onSuccess to update the parent component state
    onSuccess();
    // Close the payment form
    onClose();
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      // Only allow close if not loading
      if (!loading) {
        onClose();
      }
    }}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        {!paymentCompleted ? (
          <>
            <SheetHeader>
              <SheetTitle>Complete Payment</SheetTitle>
              <SheetDescription>
                {selectedPlan ? (
                  <span className="flex flex-col gap-1">
                    <span className="font-medium">{selectedPlan.name} - ${selectedPlan.price}</span>
                    <span className="text-sm text-gray-400">{selectedPlan.description}</span>
                  </span>
                ) : (
                  "Please select a plan first"
                )}
              </SheetDescription>
            </SheetHeader>
            
            <div className="mt-6">
              <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value as 'card' | 'apple')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Card</span>
                  </TabsTrigger>
                  <TabsTrigger value="apple" className="flex items-center gap-2">
                    <Apple className="h-4 w-4" />
                    <span>Apple Pay</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="card">
                  <Card>
                    <CardContent className="pt-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={expiryDate}
                              onChange={handleExpiryChange}
                              maxLength={5}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={cvv}
                              onChange={handleCvvChange}
                              maxLength={4}
                              type="password"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-400 gap-1 mt-2">
                          <Lock className="h-3 w-3" />
                          <span>Your payment information is secure and encrypted</span>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600"
                          disabled={loading}
                        >
                          {loading ? "Processing..." : `Pay $${selectedPlan?.price || 0}`}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="apple">
                  <Card>
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="text-center mb-6">
                        <Apple className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">
                          Click the button below to pay with Apple Pay
                        </p>
                      </div>
                      
                      <Button 
                        onClick={handleSubmit} 
                        className="w-full bg-black hover:bg-gray-900"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : `Pay with Apple Pay`}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-center">Payment Successful!</h3>
            
            <p className="text-gray-400 text-center mt-2 mb-8">
              {selectedPlan?.type === 'subscription' 
                ? `Your ${selectedPlan.name} subscription is now active.` 
                : selectedPlan?.type === 'credit' 
                  ? `Your ${selectedPlan?.credit_amount || 0} credits have been added to your account.`
                  : `Thank you for your payment.`}
            </p>
            
            <div className="w-full bg-green-900/30 rounded-lg p-4 mb-6">
              <h4 className="font-medium">Your purchase includes:</h4>
              <ul className="mt-2 space-y-2">
                {selectedPlan?.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="w-full flex flex-col space-y-2">
              <Button 
                onClick={handleContinueAfterPayment}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600"
              >
                {tabType === 'discount' ? (
                  <>
                    <Percent className="mr-2 h-4 w-4" />
                    Create Discount Deal
                  </>
                ) : tabType === 'brand-deal' ? (
                  <>
                    <Handshake className="mr-2 h-4 w-4" />
                    Create Brand Deal
                  </>
                ) : (
                  <>
                    Create Your Listing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
} 