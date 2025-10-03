// Entry point for Fastify server
// Comments in English as requested
import Fastify from 'fastify';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { registerPlugins } from './bootstrap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
loadEnv();

async function buildServer() {
  const fastify = Fastify({ logger: true });
  await registerPlugins(fastify, { rootDir: path.resolve(__dirname, '..') });
  return fastify;
}

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const host = process.env.HOST || '0.0.0.0';

buildServer()
  .then((app) => app.listen({ port, host }))
  .then((address) => {
    console.log(`[server] listening on ${address}`);
  })
  .catch((err) => {
    console.error('[server] failed to start', err);
    process.exit(1);
  });
