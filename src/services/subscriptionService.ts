
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
    return localStorage.getItem('freeDesignUsed') === 'true';
  }
  
  try {
    const subscription = await getUserSubscription();
    
    // If the user has a subscription, they've already used the free trial
    if (subscription?.is_subscribed) {
      return true;
    }
    
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
  // Update local storage for fallback
  localStorage.setItem('freeDesignUsed', 'true');
  
  if (!(await isUserAuthenticated())) {
    return;
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return;
    }
    
    await supabase
      .from('user_subscriptions')
      .update({ is_subscribed: false })
      .eq('user_id', user.id);
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
