
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { CustomButton } from "@/components/ui/CustomButton";
import { activateUserSubscription, verifyPaymentById } from "@/services/subscriptionService";
import Navbar from "@/components/layout/Navbar";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Processing your payment...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Parse URL parameters
        const success = searchParams.get('success') === 'true';
        const message = searchParams.get('data.message');
        const responseCode = searchParams.get('txn_response_code');
        const paymentId = searchParams.get('id');
        
        console.log('Payment verification:', { success, message, responseCode, paymentId });
        
        if (success && (message === 'Approved' || responseCode === 'APPROVED')) {
          // Payment successful via redirect
          if (paymentId) {
            // Activate the user's subscription
            const activated = await activateUserSubscription(paymentId);
            
            if (activated) {
              setStatus('success');
              setMessage('Your payment has been successfully processed! Your subscription is now active.');
            } else {
              setStatus('error');
              setMessage('Your payment was processed, but there was an issue activating your subscription. Please contact support.');
            }
          } else {
            setStatus('error');
            setMessage('Payment was successful but no payment ID was found. Please contact support with your transaction details.');
          }
        } else if (paymentId) {
          // Try fallback verification if we have a payment ID but success status is not clear
          console.log('Attempting fallback payment verification for ID:', paymentId);
          const verificationSuccess = await verifyPaymentById(paymentId);
          
          if (verificationSuccess) {
            setStatus('success');
            setMessage('Your payment has been successfully verified! Your subscription is now active.');
            // Wait 3 seconds then redirect to account page
            setTimeout(() => {
              navigate('/account');
            }, 3000);
          } else {
            setStatus('error');
            setMessage('We could not verify your payment. Please contact support with your payment ID.');
          }
        } else {
          // Payment failed or canceled
          setStatus('error');
          setMessage('Your payment was not successful. Please try again or contact support if you believe this is an error.');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
        setMessage('There was an error processing your payment. Please contact support.');
      }
    };

    // Wait a moment for dramatic effect and to ensure the page renders first
    const timer = setTimeout(() => {
      verifyPayment();
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-medium mb-4">Processing Payment</h1>
              <p className="text-muted-foreground">
                Please wait while we verify your payment...
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-medium mb-4">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                {message}
              </p>
              <CustomButton onClick={() => navigate('/account')}>
                View My Account
              </CustomButton>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-medium mb-4">Payment Failed</h1>
              <p className="text-muted-foreground mb-6">
                {message}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CustomButton variant="outline" onClick={() => navigate('/#pricing')}>
                  Try Again
                </CustomButton>
                <CustomButton onClick={() => navigate('/')}>
                  Return Home
                </CustomButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
