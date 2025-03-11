
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CustomButton } from "../ui/CustomButton";
import { Loader2, X } from "lucide-react";
import { createPayment } from "../../services/paymentService";
import { toast } from "sonner";

interface SubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionDialog = ({ isOpen, onClose }: SubscriptionDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const result = await createPayment(14); // $14 USD
      
      // Redirect user to the payment page
      window.location.href = result.payment_link;
      
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
          <DialogTitle className="text-xl">Upgrade to Premium</DialogTitle>
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
          <div className="rounded-lg bg-primary/10 p-4 mb-6">
            <h3 className="font-medium mb-2">Starter Package</h3>
            <p className="text-2xl font-medium mb-1">$14<span className="text-sm text-muted-foreground">/month</span></p>
            <ul className="space-y-2 mt-4 text-sm">
              <li className="flex items-start gap-2">
                <span>• Unlimited room analyses</span>
              </li>
              <li className="flex items-start gap-2">
                <span>• Detailed design recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <span>• Download design reports</span>
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
                "Subscribe Now"
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
