
/**
 * Creates a payment request to the payment gateway
 * @param amount The amount to charge in USD (will be converted to fils/cents)
 * @returns Payment URL and reference
 */
export interface PaymentResponse {
  payment_url: string;
  special_reference: string;
}

export const createPayment = async (amount: number): Promise<PaymentResponse> => {
  try {
    // Use fixed amount of 5141 fils (approximately 14 USD)
    const amountInFils = 5141;
    
    // Set the redirection URL to our payment callback page
    const redirectionUrl = `${window.location.origin}/payment-callback`;
    
    const response = await fetch('https://pay.techrealm.pk/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        amount: amountInFils,
        redirection_url: redirectionUrl
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Payment API Error (${response.status}): ${errorText || 'Failed to create payment'}`);
    }

    const data = await response.json();
    return data as PaymentResponse;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

/**
 * Verifies a payment by ID
 * @param paymentId The payment ID to verify
 * @returns Payment verification result
 */
export const verifyPayment = async (paymentId: string): Promise<any> => {
  try {
    const response = await fetch(`https://pay.techrealm.pk/verify-payment/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Payment Verification Error (${response.status}): ${errorText || 'Failed to verify payment'}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};
