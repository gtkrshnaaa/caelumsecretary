<template>
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
</template>

<script setup>
// Simple projects page fetching from /api/projects
import { ref, onMounted } from 'vue';

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
</script>
