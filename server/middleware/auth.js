import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const premiumMiddleware = async (req, res, next) => {
  try {
    const { prisma } = req.app.locals;
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (!user || user.plan !== 'PREMIUM') {
      return res.status(403).json({ 
        error: 'Premium feature',
        message: 'This feature requires a Premium subscription'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};
