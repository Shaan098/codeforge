import mongoose from 'mongoose';
import config from '../config/env.js';
import { getInitialData } from '../config/seedData.js';

let db = null;
let mongoConnected = false;

export async function initStore() {
  db = getInitialData();

  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 4000 });
    mongoConnected = true;
    console.log('MongoDB connected:', config.mongoUri);
  } catch {
    mongoConnected = false;
    console.warn('MongoDB unavailable, using in-memory seed data.');
  }

  return db;
}

export function getDb() {
  if (!db) {
    db = getInitialData();
  }
  return db;
}

export function isMongoConnected() {
  return mongoConnected;
}

export function findUser(idOrEmail) {
  const data = getDb();
  return data.users.find(
    (user) => user.id === idOrEmail || user.email === idOrEmail || user.username === idOrEmail
  );
}

export function toSafeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}
