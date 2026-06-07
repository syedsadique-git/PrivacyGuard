import { useState } from 'react';

/**
 * useUpgrade — shows a "coming soon" modal instead of real payment.
 * Swap this out when Razorpay keys are ready.
 */
export function useUpgrade() {
  const [showModal, setShowModal] = useState(false);

  const startUpgrade = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return { startUpgrade, showModal, closeModal, upgrading: false, error: '' };
}
