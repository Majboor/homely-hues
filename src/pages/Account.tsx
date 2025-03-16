
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  Crown, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  User, 
  Mail, 
  Clock, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomButton } from "@/components/ui/CustomButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getUserSubscription } from "@/services/subscriptionService";
import Navbar from "@/components/layout/Navbar";
import { format } from "date-fns";

const Account = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("Please sign in to view your account");
          navigate("/auth");
          return;
        }
        
        setUser(session.user);
        
        // Get subscription details
        const subscriptionData = await getUserSubscription();
        setSubscription(subscriptionData);
      } catch (error) {
        console.error("Error loading account data:", error);
        toast.error("Failed to load account data");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{user?.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">User ID</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.id}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Subscription Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Subscription
                  {subscription?.is_subscribed && (
                    <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1">
                      <Sparkles size={12} className="text-amber-500" />
                      Premium
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Your current subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscription ? (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                        {subscription.is_subscribed ? (
                          <>
                            Premium Plan
                            <Crown size={16} className="fill-amber-500" />
                          </>
                        ) : (
                          "Free Plan"
                        )}
                      </h3>
                      
                      {subscription.is_subscribed ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                <Calendar size={14} />
                                Start Date
                              </p>
                              <p>{formatDate(subscription.subscription_start_date)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                <Clock size={14} />
                                Renewal Date
                              </p>
                              <p>{formatDate(subscription.subscription_end_date)}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <CreditCard size={14} />
                              Payment Reference
                            </p>
                            <p className="text-sm">{subscription.payment_reference || "N/A"}</p>
                          </div>
                          
                          <div className="pt-2">
                            <p className="font-medium mb-2">Premium Benefits:</p>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle size={16} className="text-primary mt-0.5" />
                                <span>Unlimited room analyses</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle size={16} className="text-primary mt-0.5" />
                                <span>Detailed design recommendations</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle size={16} className="text-primary mt-0.5" />
                                <span>Download design reports</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle size={16} className="text-primary mt-0.5" />
                                <span>Priority support</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p>You are currently on the free plan.</p>
                          <div className="pt-2">
                            <p className="font-medium mb-2">Free Plan Features:</p>
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle size={16} className="text-primary mt-0.5" />
                                <span>One free room analysis</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No subscription data found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                {!subscription?.is_subscribed ? (
                  <CustomButton className="w-full" onClick={() => navigate("/#pricing")}>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </CustomButton>
                ) : (
                  <CustomButton className="w-full" variant="outline" onClick={() => navigate("/design")}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Designing
                  </CustomButton>
                )}
                
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
