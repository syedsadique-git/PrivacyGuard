import jwt from 'jsonwebtoken';

export const googleLogin = async (req, res) => {
  try {
    const { userInfo } = req.body;
    const { prisma } = req.app.locals;

    if (!userInfo || !userInfo.sub || !userInfo.email) {
      return res.status(400).json({ error: 'Invalid Google user info' });
    }

    const { sub: googleId, email, name, picture } = userInfo;

    // Find or create the user
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    if (user) {
      // Link Google to existing email/password account if not already linked
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId, name: name || user.name, avatar: picture || user.avatar },
        });
      }
    } else {
      // Create brand-new Google user
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          name,
          avatar: picture,
          settings: { create: {} },
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Google login error full:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ error: 'Google login failed', detail: error.message });
  }
};
