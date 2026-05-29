export const getTrackers = async (req, res) => {
  try {
    const { prisma } = req.app.locals;
    const { category, domain, blocked, startDate, endDate } = req.query;

    const where = { userId: req.userId };

    if (category) where.category = category;
    if (domain) where.domain = { contains: domain, mode: 'insensitive' };
    if (blocked !== undefined) where.isBlocked = blocked === 'true';
    if (startDate || endDate) {
      where.lastSeen = {};
      if (startDate) where.lastSeen.gte = new Date(startDate);
      if (endDate) where.lastSeen.lte = new Date(endDate);
    }

    const trackers = await prisma.tracker.findMany({
      where,
      orderBy: { lastSeen: 'desc' }
    });

    res.json({ trackers });
  } catch (error) {
    console.error('Get trackers error:', error);
    res.status(500).json({ error: 'Failed to fetch trackers' });
  }
};

export const scanTracker = async (req, res) => {
  try {
    const { domain, trackerName, category, riskLevel } = req.body;
    const { prisma } = req.app.locals;

    const existingTracker = await prisma.tracker.findFirst({
      where: {
        userId: req.userId,
        domain,
        trackerName
      }
    });

    if (existingTracker) {
      const updated = await prisma.tracker.update({
        where: { id: existingTracker.id },
        data: {
          count: { increment: 1 },
          lastSeen: new Date()
        }
      });
      return res.json({ tracker: updated, new: false });
    }

    const tracker = await prisma.tracker.create({
      data: {
        userId: req.userId,
        domain,
        trackerName,
        category,
        riskLevel: riskLevel || 'medium'
      }
    });

    res.status(201).json({ tracker, new: true });
  } catch (error) {
    console.error('Scan tracker error:', error);
    res.status(500).json({ error: 'Failed to record tracker' });
  }
};

export const toggleBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { prisma } = req.app.locals;

    const tracker = await prisma.tracker.findFirst({
      where: { id, userId: req.userId }
    });

    if (!tracker) {
      return res.status(404).json({ error: 'Tracker not found' });
    }

    const updated = await prisma.tracker.update({
      where: { id },
      data: { isBlocked: !tracker.isBlocked }
    });

    res.json({ tracker: updated });
  } catch (error) {
    console.error('Toggle block error:', error);
    res.status(500).json({ error: 'Failed to update tracker' });
  }
};

export const bulkBlock = async (req, res) => {
  try {
    const { trackerIds, block } = req.body;
    const { prisma } = req.app.locals;

    await prisma.tracker.updateMany({
      where: {
        id: { in: trackerIds },
        userId: req.userId
      },
      data: { isBlocked: block }
    });

    res.json({ message: `${trackerIds.length} trackers updated` });
  } catch (error) {
    console.error('Bulk block error:', error);
    res.status(500).json({ error: 'Failed to update trackers' });
  }
};
