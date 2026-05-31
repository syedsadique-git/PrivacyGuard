import { useState } from 'react';
import api from '../../lib/api';

/**
 * useUpgrade — opens the Razorpay checkout modal.
 * Razorpay SDK is loaded via <script> in index.html.
 * Returns { startUpgrade, upgrading, error }.
 */
export function useUpgrade() {
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');

  const startUpgrade = async () => {
    setUpgrading(true);
    setError('');

    try {
      // 1. Create order on server
      const { data } = await api.post('/payment/create-order');

      // 2. Open Razorpay checkout modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'PrivacyGuard',
        description: 'Premium Plan — ₹749/month',
        image: '/logo.png', // optional — add your logo to public/
        order_id: data.orderId,
        prefill: {
          name: data.user.name,
          email: data.user.email,
        },
        theme: { color: '#00E5CC' },
        handler: async (response) => {
          // 3. Verify payment signature on server
          try {
            await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            // Redirect to success page
            window.location.href = '/payment/success';
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
            setUpgrading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setUpgrading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setUpgrading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start checkout. Please try again.');
      setUpgrading(false);
    }
  };

  return { startUpgrade, upgrading, error };
}
