export const getMonthlyReport = async (req, res) => {
  try {
    const { prisma } = req.app.locals;

    // Get trackers from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trackers = await prisma.tracker.findMany({
      where: {
        userId: req.userId,
        lastSeen: { gte: thirtyDaysAgo }
      },
      orderBy: { lastSeen: 'asc' }
    });

    // Group by day for timeline
    const dailyStats = {};
    trackers.forEach(tracker => {
      const date = tracker.lastSeen.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = { date, count: 0, blocked: 0 };
      }
      dailyStats[date].count++;
      if (tracker.isBlocked) dailyStats[date].blocked++;
    });

    const timeline = Object.values(dailyStats).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Category breakdown
    const categoryBreakdown = trackers.reduce((acc, tracker) => {
      acc[tracker.category] = (acc[tracker.category] || 0) + 1;
      return acc;
    }, {});

    // Privacy score history (mock for MVP - would need historical data)
    const scoreHistory = timeline.map(day => ({
      date: day.date,
      score: Math.max(50, 100 - Math.floor(day.count / 2))
    }));

    res.json({
      period: {
        start: thirtyDaysAgo.toISOString(),
        end: new Date().toISOString()
      },
      timeline,
      categoryBreakdown,
      scoreHistory,
      summary: {
        totalTrackers: trackers.length,
        uniqueDomains: new Set(trackers.map(t => t.domain)).size,
        blockedCount: trackers.filter(t => t.isBlocked).length,
        averagePerDay: (trackers.length / 30).toFixed(1)
      }
    });
  } catch (error) {
    console.error('Monthly report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
