
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Get the subscription status for the current authenticated user
 */
export const getUserSubscription = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    // Fetch the subscription data
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No subscription found, this shouldn't happen but just in case
        console.error('No subscription found for user', user.id);
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};

/**
 * Check if the user has an active subscription
 */
export const isUserSubscribed = async () => {
  try {
    const subscription = await getUserSubscription();
    
    if (!subscription) {
      return false;
    }
    
    return subscription.is_subscribed;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};

/**
 * Check if the trial has been used
 */
export const hasUsedFreeTrial = async () => {
  // If not logged in, use the local storage value
  if (!(await isUserAuthenticated())) {
    const localTrialUsed = localStorage.getItem('freeDesignUsed') === 'true';
    console.log("hasUsedFreeTrial - local storage value:", localTrialUsed);
    return localTrialUsed;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("hasUsedFreeTrial - no user found, using local storage");
      return localStorage.getItem('freeDesignUsed') === 'true';
    }
    
    // Check the database
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No record found means trial has not been used yet
        console.log("hasUsedFreeTrial - no record found for user", user.id);
        return false;
      }
      throw error;
    }
    
    // If subscription record exists, we need to determine if free trial was used
    // If they're subscribed, it implies they've used the free trial
    if (data && (data.is_subscribed || data.free_trial_used)) {
      console.log("hasUsedFreeTrial - record found with is_subscribed:", data.is_subscribed, "free_trial_used:", data.free_trial_used);
      return true;
    }
    
    console.log("hasUsedFreeTrial - record exists but free trial not marked as used");
    return false;
  } catch (error) {
    console.error('Error checking if free trial used:', error);
    // Fallback to local storage
    return localStorage.getItem('freeDesignUsed') === 'true';
  }
};

/**
 * Mark that the user has used their free trial
 */
export const markFreeTrialAsUsed = async () => {
  // Update local storage for all users (fallback mechanism)
  localStorage.setItem('freeDesignUsed', 'true');
  console.log("markFreeTrialAsUsed - updated local storage");
  
  // If not authenticated, we can't update the database
  if (!(await isUserAuthenticated())) {
    return;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return;
    }
    
    console.log("markFreeTrialAsUsed - checking if record exists for user", user.id);
    
    // Check if a record already exists for this user
    const { data, error: checkError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (data) {
      // Update existing record
      console.log("markFreeTrialAsUsed - updating existing record");
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({ free_trial_used: true })
        .eq('user_id', user.id);
      
      if (updateError) throw updateError;
    } else {
      // Create a new record
      console.log("markFreeTrialAsUsed - creating new record");
      const { error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          is_subscribed: false,
          free_trial_used: true
        });
      
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error marking free trial as used:', error);
  }
};

/**
 * Check if a user is authenticated
 */
export const isUserAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

/**
 * Redirect to auth page if user is not authenticated
 * @returns boolean - true if user is authenticated, false if redirected
 */
export const requireAuth = (navigate) => {
  return async () => {
    const isAuthenticated = await isUserAuthenticated();
    
    if (!isAuthenticated) {
      toast.info("Please log in to continue");
      navigate('/auth');
      return false;
    }
    
    return true;
  };
};

/**
 * Update user subscription to active status
 */
export const activateUserSubscription = async (paymentReference: string, durationInDays: number = 30) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationInDays);
    
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        is_subscribed: true,
        subscription_start_date: startDate.toISOString(),
        subscription_end_date: endDate.toISOString(),
        payment_reference: paymentReference
      })
      .eq('user_id', user.id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Subscription activated successfully!');
    return true;
  } catch (error) {
    console.error('Error activating subscription:', error);
    toast.error('Failed to activate subscription. Please contact support.');
    return false;
  }
};

/**
 * Verify payment by payment ID
 * Used as a fallback when the redirect doesn't provide all needed information
 */
export const verifyPaymentById = async (paymentId: string): Promise<boolean> => {
  try {
    if (!paymentId) {
      console.error('No payment ID provided for verification');
      return false;
    }

    const response = await fetch(`https://pay.techrealm.pk/verify-payment/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Payment verification failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Payment verification response:', data);
    
    if (data.status === 'success' || data.status === 'APPROVED') {
      // Payment was successful
      const activated = await activateUserSubscription(paymentId);
      return activated;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};
