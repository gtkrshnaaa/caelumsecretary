// SPA without bundler using CDN ESM imports
// Comments in English only
import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { createRouter, createWebHistory } from 'https://unpkg.com/vue-router@4/dist/vue-router.esm-browser.js';

// Pages
const DashboardPage = { template: `
  <section>
    <h2 class="text-lg font-semibold mb-4">Dashboard</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="p-4 bg-white border rounded">Welcome! Quick glance of your day.</div>
      <div class="p-4 bg-white border rounded">Recent Projects</div>
    </div>
  </section>
` };

const CalendarPage = { template: `
  <section>
    <h2 class="text-lg font-semibold mb-4">Calendar</h2>
    <div class="p-4 bg-white border rounded">
      <p>Calendar view placeholder.</p>
    </div>
  </section>
` };

const ProjectsPage = {
  template: `
  <section>
    <h2 class="text-lg font-semibold mb-4">Projects</h2>

    <form @submit.prevent="createProject" class="mb-6 grid gap-3 p-4 bg-white border rounded">
      <div class="grid md:grid-cols-3 gap-3">
        <input v-model="form.name" type="text" placeholder="Project name" class="border rounded px-3 py-2" required />
        <input v-model="form.client" type="text" placeholder="Client (optional)" class="border rounded px-3 py-2" />
        <input v-model="form.tech_stack" type="text" placeholder="Tech stack (optional)" class="border rounded px-3 py-2" />
      </div>
      <div class="flex gap-2">
        <button :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Add Project</button>
        <button type="button" @click="loadProjects" class="px-4 py-2 bg-gray-100 border rounded">Reload</button>
        <span v-if="error" class="text-red-600">{{ error }}</span>
      </div>
    </form>

    <div class="grid gap-3">
      <div v-for="p in projects" :key="p.id" class="p-4 bg-white border rounded">
        <div class="flex items-center justify-between">
          <h3 class="font-medium">{{ p.name }}</h3>
          <span class="text-xs text-gray-500">{{ new Date(p.created_at).toLocaleString() }}</span>
        </div>
        <p class="text-sm text-gray-600">Client: {{ p.client || '-' }}</p>
        <p class="text-sm text-gray-600">Stack: {{ p.tech_stack || '-' }}</p>
      </div>
      <p v-if="!projects.length" class="text-sm text-gray-500">No projects yet.</p>
    </div>
  </section>
  `,
  setup() {
    const projects = ref([]);
    const error = ref('');
    const submitting = ref(false);
    const form = ref({ name: '', client: '', tech_stack: '' });

    async function loadProjects() {
      error.value = '';
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to load projects');
        const json = await res.json();
        projects.value = json.data || [];
      } catch (e) {
        error.value = e.message;
      }
    }

    async function createProject() {
      submitting.value = true;
      error.value = '';
      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to create');
        }
        form.value = { name: '', client: '', tech_stack: '' };
        await loadProjects();
      } catch (e) {
        error.value = e.message;
      } finally {
        submitting.value = false;
      }
    }

    onMounted(loadProjects);

    return { projects, error, submitting, form, loadProjects, createProject };
  }
};

const ChatPage = {
  template: `
  <section>
    <h2 class="text-lg font-semibold mb-4">Chat (AI Assistant)</h2>
    <div class="grid gap-3">
      <div class="p-4 bg-white border rounded">
        <p class="text-sm text-gray-600 mb-2">This is a placeholder chat UI. Backend endpoint is <code>/api/chat</code>.</p>
        <form @submit.prevent="send" class="flex gap-2">
          <input v-model="msg" type="text" placeholder="Ask something..." class="flex-1 border rounded px-3 py-2" />
          <button class="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        </form>
      </div>
      <div v-if="response" class="p-4 bg-white border rounded">
        <h3 class="font-medium mb-2">Response</h3>
        <pre class="text-sm whitespace-pre-wrap">{{ response }}</pre>
      </div>
    </div>
  </section>
  `,
  setup() {
    const msg = ref('');
    const response = ref('');
    async function send() {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg.value })
        });
        const text = await res.text();
        response.value = text;
      } catch (e) {
        response.value = String(e);
      }
    }
    return { msg, response, send };
  }
};

// Router
const routes = [
  { path: '/', component: DashboardPage },
  { path: '/calendar', component: CalendarPage },
  { path: '/projects', component: ProjectsPage },
  { path: '/chat', component: ChatPage }
];
const router = createRouter({ history: createWebHistory(), routes });

// Root app
const App = {
  template: `
  <div>
    <header class="border-b bg-white">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <h1 class="text-xl font-semibold">Caelum Secretary</h1>
        <nav class="ml-auto flex items-center gap-3 text-sm">
          <router-link to="/" class="hover:underline">Dashboard</router-link>
          <router-link to="/calendar" class="hover:underline">Calendar</router-link>
          <router-link to="/projects" class="hover:underline">Projects</router-link>
          <router-link to="/chat" class="hover:underline">Chat</router-link>
        </nav>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
  `
};

createApp(App).use(router).mount('#app');
