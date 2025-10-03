// API routes registration
import { HealthController } from '../../app/Http/Controllers/HealthController.js';
import { ProjectsController } from '../../app/Http/Controllers/ProjectsController.js';
import { ChatController } from '../../app/Http/Controllers/ChatController.js';

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

  // Chat (AI)
  app.post('/chat', {
    schema: {
      body: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', minLength: 1 }
        }
      }
    }
  }, ChatController.chat);
}
