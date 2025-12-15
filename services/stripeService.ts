// Mock Stripe Service
// In a real app, this would use @stripe/stripe-js and call your backend

export const simulateStripeVerification = async (cardNumber: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation: "4242..." is success, "4000..." is fail
      if (cardNumber.startsWith('4000')) {
        reject(new Error("Card declined: Your card's security code is incorrect."));
      } else {
        resolve(true);
      }
    }, 1500);
  });
};

export const processStripePayment = async (amount: number, currency: string = 'USD'): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 90% success rate for simulation
      if (Math.random() > 0.1) {
        resolve({
          success: true,
          transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`
        });
      } else {
        resolve({
          success: false,
          error: "Payment declined by bank."
        });
      }
    }, 2000);
  });
};