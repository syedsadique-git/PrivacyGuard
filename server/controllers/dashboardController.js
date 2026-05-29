export const getDashboardSummary = async (req, res) => {
  try {
    const { prisma } = req.app.locals;

    // Get tracker stats
    const trackers = await prisma.tracker.findMany({
      where: { userId: req.userId }
    });

    const uniqueDomains = new Set(trackers.map(t => t.domain)).size;
    const blockedCount = trackers.filter(t => t.isBlocked).length;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const trackersToday = trackers.filter(t => t.lastSeen >= todayStart).length;

    // Category breakdown
    const categoryBreakdown = trackers.reduce((acc, tracker) => {
      acc[tracker.category] = (acc[tracker.category] || 0) + 1;
      return acc;
    }, {});

    // Get settings
    const settings = await prisma.settings.findUnique({
      where: { userId: req.userId }
    });

    // Get breach status
    const breaches = await prisma.monitoredEmail.findMany({
      where: { userId: req.userId, breached: true }
    });

    // Calculate privacy score
    let score = 100;
    
    // Deduct for trackers (max -30)
    score -= Math.min(uniqueDomains, 30);
    
    // Deduct if global blocking is off
    if (!settings?.globalBlocking) {
      score -= 20;
    }
    
    // Deduct for breaches
    if (breaches.length > 0) {
      score -= 25;
    }

    // Deduct if no trackers detected at all (extension likely not connected)
    if (trackers.length === 0) {
      score -= 15;
    }
    
    // Bonus for all trackers blocked
    if (trackers.length > 0 && blockedCount === trackers.length) {
      score += 10;
    }

    score = Math.max(0, Math.min(100, score));

    // Top trackers
    const topTrackers = trackers
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent activity
    const recentActivity = trackers
      .sort((a, b) => b.lastSeen - a.lastSeen)
      .slice(0, 20);

    res.json({
      privacyScore: score,
      trackerStats: {
        total: trackers.length,
        uniqueDomains,
        blocked: blockedCount,
        today: trackersToday,
        categoryBreakdown
      },
      breachStatus: {
        hasBreaches: breaches.length > 0,
        count: breaches.length,
        breaches: breaches.map(b => ({
          email: b.email,
          breachData: b.breachData
        }))
      },
      topTrackers,
      recentActivity,
      globalBlocking: settings?.globalBlocking || false
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
