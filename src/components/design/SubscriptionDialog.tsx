
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CustomButton } from "../ui/CustomButton";
import { Loader2, X, Crown, Sparkles, Shield } from "lucide-react";
import { createPayment } from "../../services/paymentService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "../ui/badge";

interface SubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionDialog = ({ isOpen, onClose }: SubscriptionDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkAuthentication = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  };

  const handleSubscribe = async () => {
    try {
      // Check if user is authenticated first
      const isAuthenticated = await checkAuthentication();
      
      if (!isAuthenticated) {
        // Redirect to auth page if not authenticated
        toast.info("Please sign in to continue with your subscription");
        navigate("/auth");
        onClose();
        return;
      }
      
      setIsLoading(true);
      const result = await createPayment(14); // $14 USD
      
      // Redirect user to the payment page
      window.location.href = result.payment_url;
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Sorry, we couldn't process your payment request. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Upgrade to Premium 
            <Sparkles size={16} className="text-amber-500" />
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You've used your free design. Upgrade to continue designing more rooms.
          </DialogDescription>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="py-4">
          <div className="rounded-lg bg-primary/10 p-4 mb-6 relative">
            <Badge variant="outline" className="absolute -top-3 right-4 flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 border border-amber-200 text-xs">
              <Crown size={12} className="fill-amber-500" />
              <span>Premium</span>
            </Badge>
            <h3 className="font-medium mb-2">Starter Package</h3>
            <p className="text-2xl font-medium mb-1">$14<span className="text-sm text-muted-foreground">/month</span></p>
            <ul className="space-y-2 mt-4 text-sm">
              <li className="flex items-start gap-2">
                <Shield size={16} className="text-primary mt-0.5" />
                <span>Unlimited room analyses</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield size={16} className="text-primary mt-0.5" />
                <span>Detailed design recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield size={16} className="text-primary mt-0.5" />
                <span>Download design reports</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <CustomButton 
              className="flex-1"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-4 w-4" />
                  Subscribe Now
                </>
              )}
            </CustomButton>
            <CustomButton 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Maybe Later
            </CustomButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
