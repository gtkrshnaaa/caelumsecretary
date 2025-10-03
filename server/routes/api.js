// API routes registration
import { HealthController } from '../../app/Http/Controllers/HealthController.js';
import { ProjectsController } from '../../app/Http/Controllers/ProjectsController.js';

export default async function apiRoutes(app) {
  // Health
  app.get('/health', HealthController.index);

  // Projects
  app.get('/projects', ProjectsController.list);
  app.post('/projects', {
    schema: {
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1 },
          client: { type: 'string' },
          tech_stack: { type: 'string' }
        }
      }
    }
  }, ProjectsController.create);
}
