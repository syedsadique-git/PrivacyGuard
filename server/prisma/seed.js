import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('demo1234', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@privacyguard.com' },
    update: {},
    create: {
      email: 'demo@privacyguard.com',
      passwordHash,
      plan: 'FREE',
      settings: {
        create: {
          globalBlocking: false,
          emailAlerts: true,
          weeklyReport: true
        }
      }
    }
  });

  console.log('✅ Created demo user:', user.email);

  // Create sample trackers
  const trackerData = [
    { domain: 'google-analytics.com', trackerName: 'Google Analytics', category: 'Analytics', riskLevel: 'medium', count: 45 },
    { domain: 'facebook.com', trackerName: 'Facebook Pixel', category: 'Advertising', riskLevel: 'high', count: 32 },
    { domain: 'doubleclick.net', trackerName: 'DoubleClick', category: 'Advertising', riskLevel: 'high', count: 28 },
    { domain: 'twitter.com', trackerName: 'Twitter Analytics', category: 'Social', riskLevel: 'medium', count: 15 },
    { domain: 'linkedin.com', trackerName: 'LinkedIn Insights', category: 'Social', riskLevel: 'medium', count: 12 },
    { domain: 'hotjar.com', trackerName: 'Hotjar', category: 'Analytics', riskLevel: 'medium', count: 8 },
    { domain: 'mixpanel.com', trackerName: 'Mixpanel', category: 'Analytics', riskLevel: 'low', count: 6 },
    { domain: 'amplitude.com', trackerName: 'Amplitude', category: 'Analytics', riskLevel: 'low', count: 5 },
    { domain: 'fingerprintjs.com', trackerName: 'FingerprintJS', category: 'Fingerprinting', riskLevel: 'high', count: 18 },
    { domain: 'taboola.com', trackerName: 'Taboola', category: 'Advertising', riskLevel: 'high', count: 22 },
    { domain: 'outbrain.com', trackerName: 'Outbrain', category: 'Advertising', riskLevel: 'high', count: 19 },
    { domain: 'segment.com', trackerName: 'Segment', category: 'Analytics', riskLevel: 'medium', count: 14 }
  ];

  for (const tracker of trackerData) {
    await prisma.tracker.create({
      data: {
        userId: user.id,
        domain: tracker.domain,
        trackerName: tracker.trackerName,
        category: tracker.category,
        riskLevel: tracker.riskLevel,
        count: tracker.count,
        isBlocked: Math.random() > 0.6,
        firstSeen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
      }
    });
  }

  console.log('✅ Created sample trackers');

  // Create monitored email with breach
  await prisma.monitoredEmail.create({
    data: {
      userId: user.id,
      email: 'demo@privacyguard.com',
      breached: true,
      breachData: [
        {
          name: 'LinkedIn',
          breachDate: '2021-06-22',
          dataClasses: ['Email addresses', 'Geographic locations', 'Job titles']
        }
      ]
    }
  });

  console.log('✅ Created monitored email');
  console.log('\n🎉 Seeding complete!');
  console.log('\nDemo credentials:');
  console.log('Email: demo@privacyguard.com');
  console.log('Password: demo1234');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
