// Vue Router setup
// Comments in English
import { createRouter, createWebHistory } from 'vue-router';
import DashboardPage from './pages/DashboardPage.vue';
import CalendarPage from './pages/CalendarPage.vue';
import ProjectsPage from './pages/ProjectsPage.vue';
import ChatPage from './pages/ChatPage.vue';

const routes = [
  { path: '/', name: 'dashboard', component: DashboardPage },
  { path: '/calendar', name: 'calendar', component: CalendarPage },
  { path: '/projects', name: 'projects', component: ProjectsPage },
  { path: '/chat', name: 'chat', component: ChatPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
