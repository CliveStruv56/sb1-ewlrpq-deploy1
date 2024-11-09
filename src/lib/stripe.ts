import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
export const stripePromise = loadStripe('pk_test_your_publishable_key');

export const createPaymentIntent = async (amount: number) => {
  try {
    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};