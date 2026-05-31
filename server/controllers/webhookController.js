// Stripe Webhook handler
// NOTE: This must receive raw body — registered BEFORE express.json() in index.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const { prisma } = req.app.locals;

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode === 'subscription' && session.payment_status === 'paid') {
          const userId = session.metadata?.userId;
          const subscriptionId = session.subscription;
          if (userId) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                plan: 'PREMIUM',
                stripeSubscriptionId: subscriptionId,
              },
            });
            console.log(`✅ User ${userId} upgraded to PREMIUM`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (user) {
          const isPremium = sub.status === 'active' || sub.status === 'trialing';
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: isPremium ? 'PREMIUM' : 'FREE',
              planExpiresAt: isPremium
                ? new Date(sub.current_period_end * 1000)
                : null,
            },
          });
          console.log(`🔄 Subscription updated for user ${user.id}: ${sub.status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: sub.id },
        });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'FREE',
              stripeSubscriptionId: null,
              planExpiresAt: null,
            },
          });
          console.log(`❌ Subscription cancelled for user ${user.id}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.warn(`⚠️ Payment failed for customer ${invoice.customer}`);
        // Could send email notification here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  res.json({ received: true });
};
