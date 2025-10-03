// Events Controller
// Comments in English only
import { Event } from '../../Models/Event.js';

export const EventsController = {
  async list(_req, reply) {
    const items = Event.findAll();
    return reply.send({ data: items });
  },
  async create(req, reply) {
    const { title, starts_at, ends_at = null, location = null, notes = null } = req.body || {};
    const id = Event.create({ title, starts_at, ends_at, location, notes });
    reply.code(201);
    return reply.send({ id });
  },
  async update(req, reply) {
    const { id } = req.params;
    const changes = Event.update(Number(id), req.body || {});
    return reply.send({ updated: changes });
  },
  async remove(req, reply) {
    const { id } = req.params;
    const changes = Event.remove(Number(id));
    return reply.send({ deleted: changes });
  }
};
