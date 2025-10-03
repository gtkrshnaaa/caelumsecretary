// API routes registration
import { HealthController } from '../../app/Http/Controllers/HealthController.js';
import { ProjectsController } from '../../app/Http/Controllers/ProjectsController.js';
import { ChatController } from '../../app/Http/Controllers/ChatController.js';
import { EventsController } from '../../app/Http/Controllers/EventsController.js';
import { TasksController } from '../../app/Http/Controllers/TasksController.js';
import { RequirementsController } from '../../app/Http/Controllers/RequirementsController.js';
import { ProfileController } from '../../app/Http/Controllers/ProfileController.js';
import { ExportController } from '../../app/Http/Controllers/ExportController.js';

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

  // Events
  app.get('/events', EventsController.list);
  app.post('/events', {
    schema: {
      body: {
        type: 'object',
        required: ['title','starts_at'],
        properties: {
          title: { type: 'string', minLength: 1 },
          starts_at: { type: 'string', minLength: 1 },
          ends_at: { type: 'string' },
          location: { type: 'string' },
          notes: { type: 'string' }
        }
      }
    }
  }, EventsController.create);
  app.put('/events/:id', EventsController.update);
  app.delete('/events/:id', EventsController.remove);

  // Tasks (by project)
  app.get('/projects/:project_id/tasks', TasksController.list);
  app.post('/projects/:project_id/tasks', {
    schema: {
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1 },
          status: { type: 'string' },
          due_date: { type: 'string' }
        }
      }
    }
  }, TasksController.create);
  app.put('/tasks/:id', TasksController.update);
  app.delete('/tasks/:id', TasksController.remove);

  // Requirements (by project)
  app.get('/projects/:project_id/requirements', RequirementsController.list);
  app.post('/projects/:project_id/requirements', {
    schema: {
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1 },
          description: { type: 'string' }
        }
      }
    }
  }, RequirementsController.create);
  app.put('/requirements/:id', RequirementsController.update);
  app.delete('/requirements/:id', RequirementsController.remove);

  // Profile
  app.get('/profile', ProfileController.get);
  app.put('/profile', ProfileController.update);

  // Export JSON (context for AI)
  app.get('/export', ExportController.exportJson);
}
