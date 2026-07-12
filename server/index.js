import './bootstrap.js';

import app from './app.js';
import config from './config/env.js';
import { initStore } from './services/store.js';

async function start() {
  await initStore();

  app.listen(config.port, () => {
    console.log(`CodeForge server running on http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`Client URL: ${config.clientUrl}`);
    console.log(`Mistral AI: ${config.mistralApiKey ? 'key loaded' : 'key missing'}`);
  });
}

start();
