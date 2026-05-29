import bcrypt from 'bcrypt';

export const getSettings = async (req, res) => {
  try {
    const { prisma } = req.app.locals;

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { settings: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      profile: {
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt
      },
      settings: user.settings || {}
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { prisma } = req.app.locals;
    const { globalBlocking, emailAlerts, weeklyReport, email, currentPassword, newPassword } = req.body;

    // Update settings
    if (globalBlocking !== undefined || emailAlerts !== undefined || weeklyReport !== undefined) {
      const updateData = {};
      if (globalBlocking !== undefined) updateData.globalBlocking = globalBlocking;
      if (emailAlerts !== undefined) updateData.emailAlerts = emailAlerts;
      if (weeklyReport !== undefined) updateData.weeklyReport = weeklyReport;

      await prisma.settings.upsert({
        where: { userId: req.userId },
        update: updateData,
        create: {
          userId: req.userId,
          ...updateData
        }
      });
    }

    // Update email
    if (email) {
      const existing = await prisma.user.findUnique({
        where: { email }
      });

      if (existing && existing.id !== req.userId) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      await prisma.user.update({
        where: { id: req.userId },
        data: { email }
      });
    }

    // Update password
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: req.userId }
      });

      const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);

      if (!validPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: req.userId },
        data: { passwordHash: newPasswordHash }
      });
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { prisma } = req.app.locals;

    await prisma.user.delete({
      where: { id: req.userId }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};
