import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { findUser, getDb } from '../services/store.js';

export function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    const devUser = req.body?.userId ? findUser(req.body.userId) : null;
    if (config.isDev && devUser) {
      req.user = { id: devUser.id, username: devUser.username };
      return next();
    }

    return res.status(401).json({ error: 'Unauthorized. Token required.' });
  }

  try {
    req.user = jwt.verify(authHeader.split(' ')[1], config.jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

export function adminOnly(req, res, next) {
  const data = getDb();
  const user = data.users.find((item) => item.id === req.user?.id);
  const admins = ['CodeCraftMaster', 'admin'];

  if (!admins.includes(user?.username || req.user?.username)) {
    return res.status(403).json({ error: 'Admin access required.' });
  }

  next();
}
