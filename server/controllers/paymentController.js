import Razorpay from 'razorpay';
import crypto from 'crypto';

const PREMIUM_AMOUNT = 74900; // ₹749/month in paise
const CURRENCY = 'INR';

// Lazy getter — only instantiates when actually called, so missing env vars
// don't crash the server at startup.
function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET env vars.');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Step 1: Create a Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const { prisma } = req.app.locals;
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.plan === 'PREMIUM') {
      return res.status(400).json({ error: 'Already on Premium plan' });
    }

    const order = await razorpay.orders.create({
      amount: PREMIUM_AMOUNT,
      currency: CURRENCY,
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: { userId: user.id, email: user.email },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      user: { name: user.name || '', email: user.email },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

// Step 2: Verify payment signature after Razorpay checkout completes
export const verifyPayment = async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const { prisma } = req.app.locals;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const userId = payment.notes?.userId || req.userId;

    const planExpiresAt = new Date();
    planExpiresAt.setMonth(planExpiresAt.getMonth() + 1);

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'PREMIUM',
        stripeSubscriptionId: razorpay_payment_id,
        planExpiresAt,
      },
    });

    console.log(`✅ User ${userId} upgraded to PREMIUM via Razorpay`);
    res.json({ success: true, message: 'Payment verified. Welcome to Premium!' });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// Get subscription status
export const getSubscriptionStatus = async (req, res) => {
  try {
    const { prisma } = req.app.locals;
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ plan: user.plan, planExpiresAt: user.planExpiresAt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
};

// Cancel / downgrade
export const cancelSubscription = async (req, res) => {
  try {
    const { prisma } = req.app.locals;
    await prisma.user.update({
      where: { id: req.userId },
      data: { plan: 'FREE', stripeSubscriptionId: null, planExpiresAt: null },
    });
    res.json({ message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};
