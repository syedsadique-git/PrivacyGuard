import axios from 'axios';
import jwt from 'jsonwebtoken';

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const { prisma } = req.app.locals;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    // Fetch user info using the Google access token
    const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${credential}` },
    });

    const { sub: googleId, email, name, picture } = googleRes.data;

    if (!email) {
      return res.status(400).json({ error: 'Google account must have an email' });
    }

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
    console.error('Google login error:', error?.response?.data || error.message);
    res.status(401).json({ error: 'Invalid Google credential' });
  }
};
