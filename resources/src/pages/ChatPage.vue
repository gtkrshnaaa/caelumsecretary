<template>
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
</template>

<script setup>
// Placeholder chat page
import { ref } from 'vue';

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
</script>
