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

const ProfilePage = {
  template: `
  <section>
    <h2 class="text-lg font-semibold mb-4">Profile</h2>
    <form @submit.prevent="save" class="grid gap-3 p-4 bg-white border rounded">
      <div class="grid md:grid-cols-2 gap-3">
        <input v-model="form.name" type="text" placeholder="Name" class="border rounded px-3 py-2" />
        <input v-model="form.role" type="text" placeholder="Role" class="border rounded px-3 py-2" />
      </div>
      <textarea v-model="form.preferences_json" placeholder="Preferences JSON" rows="4" class="border rounded px-3 py-2"></textarea>
      <textarea v-model="form.ai_persona" placeholder="AI Persona JSON" rows="4" class="border rounded px-3 py-2"></textarea>
      <div class="flex items-center gap-2">
        <button :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Save</button>
        <span v-if="error" class="text-red-600 text-sm">{{ error }}</span>
        <span v-if="saved" class="text-green-600 text-sm">Saved</span>
      </div>
    </form>
  </section>
  `,
  setup() {
    const form = ref({ name: '', role: '', preferences_json: '{}', ai_persona: '{}' });
    const error = ref('');
    const saving = ref(false);
    const saved = ref(false);

    async function load() {
      error.value = '';
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to load profile');
        const json = await res.json();
        const d = json.data || {};
        form.value = {
          name: d.name || '',
          role: d.role || '',
          preferences_json: d.preferences_json || '{}',
          ai_persona: d.ai_persona || '{}'
        };
      } catch (e) {
        error.value = e.message;
      }
    }

    async function save() {
      saving.value = true;
      saved.value = false;
      error.value = '';
      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        });
        if (!res.ok) throw new Error('Failed to save');
        saved.value = true;
      } catch (e) {
        error.value = e.message;
      } finally {
        saving.value = false;
        setTimeout(() => (saved.value = false), 1500);
      }
    }

    onMounted(load);
    return { form, error, saving, saved, save };
  }
};

const CalendarPage = {
  template: `
  <section>
    <h2 class="text-lg font-semibold mb-4">Calendar</h2>

    <form @submit.prevent="createEvent" class="mb-6 grid gap-3 p-4 bg-white border rounded">
      <div class="grid md:grid-cols-2 gap-3">
        <input v-model="form.title" type="text" placeholder="Event title" class="border rounded px-3 py-2" required />
        <input v-model="form.location" type="text" placeholder="Location (optional)" class="border rounded px-3 py-2" />
      </div>
      <div class="grid md:grid-cols-2 gap-3">
        <input v-model="form.starts_at" type="datetime-local" class="border rounded px-3 py-2" required />
        <input v-model="form.ends_at" type="datetime-local" class="border rounded px-3 py-2" />
      </div>
      <textarea v-model="form.notes" placeholder="Notes (optional)" class="border rounded px-3 py-2"></textarea>
      <div class="flex items-center gap-2">
        <button :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Add Event</button>
        <button type="button" @click="loadEvents" class="px-4 py-2 bg-gray-100 border rounded">Reload</button>
        <span v-if="error" class="text-red-600 text-sm">{{ error }}</span>
      </div>
    </form>

    <div class="grid gap-3">
      <div v-for="e in events" :key="e.id" class="p-4 bg-white border rounded">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">{{ e.title }}</h3>
            <p class="text-xs text-gray-600">{{ e.starts_at }} → {{ e.ends_at || '-' }}</p>
            <p class="text-xs text-gray-600">{{ e.location || '-' }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="removeEvent(e.id)" class="px-3 py-1 text-sm bg-red-600 text-white rounded">Delete</button>
          </div>
        </div>
        <p class="text-sm text-gray-600 mt-2" v-if="e.notes">{{ e.notes }}</p>
      </div>
      <p v-if="!events.length" class="text-sm text-gray-500">No events yet.</p>
    </div>
  </section>
  `,
  setup() {
    const events = ref([]);
    const error = ref('');
    const submitting = ref(false);
    const form = ref({ title: '', starts_at: '', ends_at: '', location: '', notes: '' });

    async function loadEvents() {
      error.value = '';
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to load events');
        const json = await res.json();
        events.value = json.data || [];
      } catch (e) {
        error.value = e.message;
      }
    }

    async function createEvent() {
      submitting.value = true;
      error.value = '';
      try {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to create event');
        }
        form.value = { title: '', starts_at: '', ends_at: '', location: '', notes: '' };
        await loadEvents();
      } catch (e) {
        error.value = e.message;
      } finally {
        submitting.value = false;
      }
    }

    async function removeEvent(id) {
      try {
        const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        await loadEvents();
      } catch (e) {
        error.value = e.message;
      }
    }

    onMounted(loadEvents);
    return { events, error, submitting, form, loadEvents, createEvent, removeEvent };
  }
};

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
  { path: '/chat', component: ChatPage },
  { path: '/profile', component: ProfilePage }
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
          <router-link to="/profile" class="hover:underline">Profile</router-link>
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
