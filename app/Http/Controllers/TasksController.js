// Tasks Controller
// Comments in English only
import { Task } from '../../Models/Task.js';

export const TasksController = {
  async list(req, reply) {
    const { project_id } = req.params;
    const items = Task.findByProject(Number(project_id));
    return reply.send({ data: items });
  },
  async create(req, reply) {
    const { project_id } = req.params;
    const { title, status = 'todo', due_date = null } = req.body || {};
    const id = Task.create({ project_id: Number(project_id), title, status, due_date });
    reply.code(201);
    return reply.send({ id });
  },
  async update(req, reply) {
    const { id } = req.params;
    const changes = Task.update(Number(id), req.body || {});
    return reply.send({ updated: changes });
  },
  async remove(req, reply) {
    const { id } = req.params;
    const changes = Task.remove(Number(id));
    return reply.send({ deleted: changes });
  }
};
