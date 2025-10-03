// Projects Controller
import { Project } from '../../Models/Project.js';

export const ProjectsController = {
  async list(request, reply) {
    const items = Project.findAll();
    return reply.send({ data: items });
  },

  async create(request, reply) {
    const { name, client = null, tech_stack = null } = request.body || {};
    const id = Project.create({ name, client, tech_stack });
    reply.code(201);
    return reply.send({ id, name, client, tech_stack });
  }
};
