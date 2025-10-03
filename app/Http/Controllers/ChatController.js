// Chat Controller
// Comments in English only
import { chatWithGemini } from '../../../server/lib/gemini.js';
import { Project } from '../../Models/Project.js';

export const ChatController = {
  async chat(request, reply) {
    const { message = '' } = request.body || {};
    // Minimal context example: project count and latest names
    const projects = Project.findAll();
    const context = {
      project_count: projects.length,
      latest_projects: projects.slice(0, 5).map((p) => ({ id: p.id, name: p.name }))
    };

    const result = await chatWithGemini({ message, context });
    return reply.send(result);
  }
};
