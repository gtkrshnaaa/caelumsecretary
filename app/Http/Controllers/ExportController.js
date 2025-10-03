// Export Controller - combine data for AI context
// Comments in English only
import { Project } from '../../Models/Project.js';
import { Task } from '../../Models/Task.js';
import { Event } from '../../Models/Event.js';
import { ProjectRequirement } from '../../Models/ProjectRequirement.js';
import { Profile } from '../../Models/Profile.js';

export const ExportController = {
  async exportJson(_req, reply) {
    const projects = Project.findAll();
    const events = Event.findAll();
    const profile = Profile.get();

    // Aggregate requirements and tasks per project
    const projectsFull = projects.map((p) => {
      const requirements = ProjectRequirement.findByProject(p.id);
      const tasks = Task.findByProject(p.id);
      return { ...p, requirements, tasks };
    });

    const payload = {
      profile,
      projects: projectsFull,
      events
    };

    return reply.send(payload);
  }
};
