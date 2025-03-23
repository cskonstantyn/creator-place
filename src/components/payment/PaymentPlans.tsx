import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentPlan, getPaymentPlans } from "@/services/paymentService";
import { toast } from "sonner";

interface PaymentPlansProps {
  type: 'brand-deal' | 'discount-deal';
  onSelectPlan: (plan: PaymentPlan) => void;
}

export function PaymentPlans({ type, onSelectPlan }: PaymentPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const allPlans = await getPaymentPlans();
        // Filter plans by type
        const filteredPlans = allPlans.filter(plan => plan.type === type);
        setPlans(filteredPlans);
      } catch (error) {
        console.error("Error fetching payment plans:", error);
        toast.error("Failed to load payment plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, [type]);
  
  const handleSelectPlan = (plan: PaymentPlan) => {
    setSelectedPlan(plan.id);
    onSelectPlan(plan);
  };
  
  if (loading) {
    return (
      <div className="space-y-6 text-center py-8">
        <h2 className="text-2xl font-bold">Loading Plans...</h2>
      </div>
    );
  }
  
  if (plans.length === 0) {
    return (
      <div className="space-y-6 text-center py-8">
        <h2 className="text-2xl font-bold">No Plans Available</h2>
        <p className="text-gray-400">Please try again later or contact support.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose a Plan</h2>
        <p className="text-gray-400 mt-2">
          Select a plan to publish your {type === 'brand-deal' ? 'brand deal' : 'discount code'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`glassmorphism border-2 transition-all ${
              selectedPlan === plan.id 
                ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{plan.name}</span>
                <span className="text-2xl font-bold text-purple-400">${plan.price}</span>
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${
                  selectedPlan === plan.id 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                    : ''
                }`}
                variant={selectedPlan === plan.id ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan)}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 