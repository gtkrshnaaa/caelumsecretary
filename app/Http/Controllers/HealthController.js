// Health Controller
export const HealthController = {
  async index(request, reply) {
    // Simple health payload
    return reply.send({ status: 'ok', service: 'caelumsecretary', time: new Date().toISOString() });
  }
};
