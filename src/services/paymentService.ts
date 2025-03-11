
/**
 * Creates a payment request to the payment gateway
 * @param amount The amount to charge in USD (will be converted to fils/cents)
 * @returns Payment link and reference
 */
export interface PaymentResponse {
  payment_link: string;
  payment_reference: string;
}

export const createPayment = async (amount: number): Promise<PaymentResponse> => {
  try {
    // Convert USD to cents (100 = 1 AED, so 1 USD = approx 367 fils)
    // 14 USD ≈ 5142 fils
    const amountInFils = Math.round(amount * 367.28);
    
    const response = await fetch('https://pay.techrealm.pk/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amountInFils }),
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
