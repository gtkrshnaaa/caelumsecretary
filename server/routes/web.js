// Web routes (optional SSR or static helpers)
export default async function webRoutes(app) {
  // Example root path returning a minimal HTML or redirect to index.html
  app.get('/', async (_, reply) => {
    // In production, index.html is in public/
    return reply.type('text/html').send('<!doctype html><html><head><meta charset="utf-8"><title>Caelum Secretary</title></head><body><h1>Caelum Secretary</h1><p>Backend is running.</p></body></html>');
  });
}
