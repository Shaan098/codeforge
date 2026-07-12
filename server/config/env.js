/**
 * server/config/env.js
 * Centralized environment variable validation and configuration.
 * Fails fast at startup if required variables are missing.
 */

const required = ['MONGODB_URI', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`\n❌ FATAL: Missing required environment variable: ${key}`);
    console.error('Please copy .env.example to .env and fill in all values.\n');
    process.exit(1);
  }
}

if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
  console.error('\n❌ FATAL: JWT_SECRET must be at least 32 characters in production.\n');
  process.exit(1);
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  defaultUserPassword: process.env.DEFAULT_USER_PASSWORD || 'codeforge123',
  mistralApiKey: process.env.MISTRAL_API_KEY || process.env.MINSTRAL_API_KEY || '',
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',
};

export default config;
