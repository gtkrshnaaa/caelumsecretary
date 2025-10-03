// Requirements Controller
// Comments in English only
import { ProjectRequirement } from '../../Models/ProjectRequirement.js';

export const RequirementsController = {
  async list(req, reply) {
    const { project_id } = req.params;
    const items = ProjectRequirement.findByProject(Number(project_id));
    return reply.send({ data: items });
  },
  async create(req, reply) {
    const { project_id } = req.params;
    const { title, description = null } = req.body || {};
    const id = ProjectRequirement.create({ project_id: Number(project_id), title, description });
    reply.code(201);
    return reply.send({ id });
  },
  async update(req, reply) {
    const { id } = req.params;
    const changes = ProjectRequirement.update(Number(id), req.body || {});
    return reply.send({ updated: changes });
  },
  async remove(req, reply) {
    const { id } = req.params;
    const changes = ProjectRequirement.remove(Number(id));
    return reply.send({ deleted: changes });
  }
};
