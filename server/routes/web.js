// Web routes (SPA fallback)
// Comments in English only
export default async function webRoutes(app) {
  // Serve SPA index.html for root
  app.get('/', async (_req, reply) => {
    return reply.sendFile('index.html');
  });

  // Catch-all for client-side routes (avoid /api prefix)
  app.get('/*', async (req, reply) => {
    if (req.raw.url && req.raw.url.startsWith('/api')) {
      return reply.callNotFound();
    }
    return reply.sendFile('index.html');
  });
}
