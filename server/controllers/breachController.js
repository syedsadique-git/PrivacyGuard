import axios from 'axios';

export const checkBreach = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }

    // For MVP, we'll use mock data if HIBP API key is not available
    // In production, use: https://haveibeenpwned.com/API/v3
    
    if (process.env.HIBP_API_KEY && process.env.HIBP_API_KEY !== 'your-haveibeenpwned-api-key') {
      try {
        const response = await axios.get(
          `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`,
          {
            headers: {
              'hibp-api-key': process.env.HIBP_API_KEY,
              'User-Agent': 'PrivacyGuard'
            }
          }
        );

        return res.json({
          breached: true,
          breaches: response.data.map(breach => ({
            name: breach.Name,
            title: breach.Title,
            domain: breach.Domain,
            breachDate: breach.BreachDate,
            addedDate: breach.AddedDate,
            dataClasses: breach.DataClasses,
            description: breach.Description,
            isVerified: breach.IsVerified
          }))
        });
      } catch (error) {
        if (error.response?.status === 404) {
          return res.json({ breached: false, breaches: [] });
        }
        throw error;
      }
    }

    // Mock data for MVP
    const mockBreaches = [
      {
        name: 'LinkedIn',
        title: 'LinkedIn',
        domain: 'linkedin.com',
        breachDate: '2021-06-22',
        addedDate: '2021-06-22',
        dataClasses: ['Email addresses', 'Geographic locations', 'Job titles', 'Names', 'Phone numbers'],
        description: 'In June 2021, data scraped from 700M LinkedIn users was posted for sale on a hacker forum.',
        isVerified: true
      },
      {
        name: 'Adobe',
        title: 'Adobe',
        domain: 'adobe.com',
        breachDate: '2013-10-04',
        addedDate: '2013-12-04',
        dataClasses: ['Email addresses', 'Password hints', 'Passwords', 'Usernames'],
        description: 'In October 2013, 153 million Adobe accounts were breached with each containing an internal ID, username, email, encrypted password and a password hint in plain text.',
        isVerified: true
      }
    ];

    // Simulate breach check - 40% chance of breach for demo
    const isBreached = Math.random() < 0.4;

    res.json({
      breached: isBreached,
      breaches: isBreached ? mockBreaches : []
    });
  } catch (error) {
    console.error('Breach check error:', error);
    res.status(500).json({ error: 'Failed to check breach status' });
  }
};

export const getMonitoredEmails = async (req, res) => {
  try {
    const { prisma } = req.app.locals;

    const emails = await prisma.monitoredEmail.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ emails });
  } catch (error) {
    console.error('Get monitored emails error:', error);
    res.status(500).json({ error: 'Failed to fetch monitored emails' });
  }
};

export const monitorEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const { prisma } = req.app.locals;

    const existing = await prisma.monitoredEmail.findFirst({
      where: { userId: req.userId, email }
    });

    if (existing) {
      return res.status(400).json({ error: 'Email already monitored' });
    }

    // Check breach status
    const breachCheck = await checkBreachInternal(email);

    const monitored = await prisma.monitoredEmail.create({
      data: {
        userId: req.userId,
        email,
        breached: breachCheck.breached,
        breachData: breachCheck.breached ? breachCheck.breaches : null
      }
    });

    res.status(201).json({ email: monitored });
  } catch (error) {
    console.error('Monitor email error:', error);
    res.status(500).json({ error: 'Failed to monitor email' });
  }
};

// Internal helper function
async function checkBreachInternal(email) {
  // Mock implementation for MVP
  const isBreached = Math.random() < 0.4;
  return {
    breached: isBreached,
    breaches: isBreached ? [{
      name: 'LinkedIn',
      breachDate: '2021-06-22',
      dataClasses: ['Email addresses', 'Names']
    }] : []
  };
}
