
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import UploadRoom from "../components/design/UploadRoom";
import DesignSuggestion from "../components/design/DesignSuggestion";
import SubscriptionDialog from "../components/design/SubscriptionDialog";
import { CustomButton } from "../components/ui/CustomButton";
import { ArrowRight, Wand, Crown, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  hasUsedFreeTrial, 
  markFreeTrialAsUsed, 
  isUserSubscribed, 
  isUserAuthenticated, 
  requireAuth,
  resetFreeTrial
} from "../services/subscriptionService";
import { toast } from "sonner";

const Design = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [freeTrialUsed, setFreeTrialUsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = requireAuth(navigate);

  useEffect(() => {
    const checkUserStatus = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authenticated = !!session;
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          // For newly registered users, ensure they get their free trial
          await resetFreeTrial();
          
          const [subscribed, trialUsed] = await Promise.all([
            isUserSubscribed(),
            hasUsedFreeTrial()
          ]);
          
          console.log("Design page - Free trial used:", trialUsed);
          console.log("Design page - Is subscribed:", subscribed);
          
          setIsSubscribed(subscribed);
          setFreeTrialUsed(trialUsed);
        } else {
          const localTrialUsed = localStorage.getItem('freeDesignUsed') === 'true';
          console.log("Design page - Local storage free trial used:", localTrialUsed);
          setFreeTrialUsed(localTrialUsed);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        toast.error("Failed to check subscription status");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserStatus();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      console.log("Auth state changed");
      checkUserStatus();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (freeTrialUsed && !isSubscribed && !uploadedImage) {
      setShowSubscriptionDialog(true);
    }
  }, [freeTrialUsed, isSubscribed, uploadedImage]);

  const handleImageUploaded = async (imageUrl: string, file?: File) => {
    if (!isAuthenticated) {
      toast.info("Please log in to upload images");
      navigate('/auth');
      return;
    }
    
    // Re-check the trial status before processing
    const [trialUsed, subscribed] = await Promise.all([
      hasUsedFreeTrial(),
      isUserSubscribed()
    ]);
    
    console.log("Before image upload - Free trial used:", trialUsed);
    console.log("Before image upload - Is subscribed:", subscribed);
    
    setFreeTrialUsed(trialUsed);
    setIsSubscribed(subscribed);
    
    // Allow upload if user is subscribed OR hasn't used free trial
    if (subscribed || !trialUsed) {
      // Mark free trial as used if this is their first time and they're not subscribed
      if (!trialUsed && !subscribed) {
        console.log("Marking free trial as used on first upload");
        await markFreeTrialAsUsed();
        setFreeTrialUsed(true);
      }
      
      setUploadedImage(imageUrl);
      if (file) setUploadedFile(file);
    } else {
      toast.info("You've used your free design. Please upgrade to continue.");
      setShowSubscriptionDialog(true);
    }
  };

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!await checkAuth()) {
      return;
    }
    
    // Prevent the default form submission behavior that might cause a refresh
    e.stopPropagation();
    
    if (isSubscribed || !freeTrialUsed) {
      if (uploadedFile) {
        const tempImage = uploadedImage;
        const tempFile = uploadedFile;
        setUploadedImage(null);
        setUploadedFile(null);
        
        // Use setTimeout to ensure state updates properly
        setTimeout(() => {
          setUploadedImage(tempImage);
          setUploadedFile(tempFile);
        }, 100);
      }
    } else {
      setShowSubscriptionDialog(true);
    }
  };

  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use navigate instead of modifying window.location directly to prevent refresh
    navigate('/#pricing');
  };

  const redirectToAuth = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-medium mb-4">Design Your Space</h1>
            {isSubscribed && (
              <div className="flex items-center justify-center gap-2 text-amber-500 mb-4">
                <Crown size={20} className="fill-amber-500" />
                <span className="font-medium">Premium Member</span>
              </div>
            )}
            {freeTrialUsed && !isSubscribed && (
              <div className="flex items-center justify-center gap-2 text-amber-500 mb-4 bg-amber-50 py-2 px-4 rounded-md mx-auto max-w-fit">
                <AlertTriangle size={20} className="text-amber-500" />
                <span className="font-medium">Free trial used - Upgrade to continue</span>
              </div>
            )}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a photo of your room and our AI will generate personalized interior design suggestions.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Upload Your Room</h2>
              {isSubscribed && (
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Crown size={16} className="fill-amber-500" />
                  <span className="text-sm font-medium">Premium</span>
                </div>
              )}
            </div>
            <UploadRoom onImageUploaded={handleImageUploaded} />
          </div>
          
          {uploadedImage ? (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Design Suggestions</h2>
                <div className="flex items-center gap-3">
                  {isSubscribed && (
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      <Crown size={16} className="fill-amber-500" />
                      <span className="text-sm font-medium">Premium</span>
                    </div>
                  )}
                  <CustomButton variant="outline" size="sm" onClick={handleRegenerate}>
                    <Wand className="mr-2 h-4 w-4" />
                    Regenerate
                  </CustomButton>
                </div>
              </div>
              
              <DesignSuggestion roomImage={uploadedImage} originalFile={uploadedFile || undefined} />
              
              {!isSubscribed && (
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Want to see more design options and detailed recommendations?
                  </p>
                  <CustomButton onClick={scrollToPricing}>
                    Upgrade to Premium
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </CustomButton>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-8 text-center space-y-4 animate-fade-in">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Wand className="h-8 w-8 text-primary" />
              </div>
              
              {isSubscribed && (
                <div className="flex items-center justify-center gap-2 text-amber-500">
                  <Crown size={20} className="fill-amber-500" />
                  <span className="font-medium">Premium Unlimited Designs</span>
                </div>
              )}
              
              <h3 className="text-xl font-medium">Your design journey starts with an image</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Upload a photo of your room above to see AI-generated design suggestions tailored to your space.
              </p>
              
              {!isAuthenticated ? (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium mb-2">Create an account to save your designs</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sign up for a free account to save your designs and access more features
                  </p>
                  <CustomButton size="sm" onClick={redirectToAuth}>
                    Sign Up / Login
                  </CustomButton>
                </div>
              ) : freeTrialUsed && !isSubscribed ? (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="font-medium mb-2">You've used your free design</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upgrade to our Starter Package for unlimited designs
                  </p>
                  <CustomButton size="sm" onClick={scrollToPricing}>
                    View Pricing
                  </CustomButton>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      
      <SubscriptionDialog 
        isOpen={showSubscriptionDialog} 
        onClose={() => setShowSubscriptionDialog(false)} 
      />
    </div>
  );
};

export default Design;
