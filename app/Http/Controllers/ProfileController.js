// Profile Controller
// Comments in English only
import { Profile } from '../../Models/Profile.js';

export const ProfileController = {
  async get(_req, reply) {
    const row = Profile.get();
    return reply.send({ data: row });
  },
  async update(req, reply) {
    const payload = req.body || {};
    const changes = Profile.update(payload);
    return reply.send({ updated: changes });
  }
};
