<template>
  <div>
    <header class="border-b bg-white">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <h1 class="text-xl font-semibold">Caelum Secretary</h1>
        <nav class="ml-auto flex items-center gap-3 text-sm">
          <RouterLink to="/" class="hover:underline">Dashboard</RouterLink>
          <RouterLink to="/calendar" class="hover:underline">Calendar</RouterLink>
          <RouterLink to="/projects" class="hover:underline">Projects</RouterLink>
          <RouterLink to="/chat" class="hover:underline">Chat</RouterLink>
        </nav>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
// Keep script minimal
</script>

<style scoped>
/* Keep styles minimal; Tailwind handles most */
</style>
