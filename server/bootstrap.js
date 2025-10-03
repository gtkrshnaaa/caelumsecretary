// Fastify plugins and route registration
import path from 'node:path';
import FastifyStatic from '@fastify/static';
import FastifyCors from '@fastify/cors';
import FastifyFormBody from '@fastify/formbody';

import apiRoutes from './routes/api.js';
import webRoutes from './routes/web.js';

export async function registerPlugins(app, { rootDir }) {
  // Enable CORS in development only
  const isDev = process.env.NODE_ENV !== 'production';
  await app.register(FastifyCors, { origin: isDev ? true : false });
  await app.register(FastifyFormBody);

  // Serve static public directory
  const publicDir = path.join(rootDir, 'public');
  await app.register(FastifyStatic, { root: publicDir, prefix: '/' });

  // Register routes
  await app.register(apiRoutes, { prefix: '/api' });
  await app.register(webRoutes);
}
