<script setup>
import { onMounted, ref, watch } from 'vue';
import BaseButton from './components/BaseButton.vue';
import DogForm from './components/DogForm.vue';
import DogTable from './components/DogTable.vue';
import { useTheme } from './composables/useTheme.js';
import { dogsApi } from './services/api.js';

const dogs = ref([]);
const loading = ref(true);
const saving = ref(false);
const sort = ref('name');
const formDog = ref(null);
const formOpen = ref(false);
const toast = ref('');
const error = ref('');
const { isDark, toggleTheme } = useTheme();
async function loadDogs() {
  loading.value = true;
  error.value = '';
  try {
    const response = await dogsApi.list({ sort: sort.value });
    dogs.value = response.data;
  } catch (requestError) {
    error.value = requestError.message;
  } finally {
    loading.value = false;
  }
}

function openCreate() { formDog.value = null; formOpen.value = true; }
function openEdit(dog) { formDog.value = dog; formOpen.value = true; }
function closeForm() { if (!saving.value) formOpen.value = false; }
function notify(message) {
  toast.value = message;
  window.setTimeout(() => { if (toast.value === message) toast.value = ''; }, 3_500);
}

async function saveDog(payload) {
  saving.value = true;
  try {
    if (formDog.value) {
      await dogsApi.update(formDog.value._id, payload);
      notify('Breed updated');
    } else {
      await dogsApi.create(payload);
      notify('Breed added');
    }
    formOpen.value = false;
    await loadDogs();
  } catch (requestError) {
    notify(requestError.message);
  } finally {
    saving.value = false;
  }
}

async function deleteDog(dog) {
  const confirmed = window.confirm(`Delete ${dog.name}? This cannot be undone.`);
  if (!confirmed) return;
  try {
    await dogsApi.remove(dog._id);
    notify(`${dog.name} deleted`);
    await loadDogs();
  } catch (requestError) {
    notify(requestError.message);
  }
}

watch(sort, () => {
  loadDogs();
});
onMounted(loadDogs);
</script>

<template>
  <main class="relative mx-auto max-w-290 px-4 pb-6 md:grid md:h-full md:grid-rows-[64px_auto_minmax(0,1fr)] md:px-7">
    <header class="flex h-16 items-center justify-between">
      <a class="inline-flex items-center gap-2 font-bold tracking-tight text-[var(--text)] no-underline" href="/" aria-label="Dog Catalogue home"><span class="text-xl">🐾</span> Dog Catalogue</a>
      <button class="rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-px hover:bg-[var(--surface-muted)]" type="button" :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`" @click="toggleTheme">
        {{ isDark ? '☀ Light' : '☾ Dark' }}
      </button>
    </header>

    <section class="mb-4 flex items-center gap-3" aria-label="Catalogue controls">
      <label class="flex items-center gap-2 whitespace-nowrap text-sm text-[var(--muted)]">Sort <select v-model="sort" class="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--text)]" aria-label="Sort breeds"><option value="name">Name A–Z</option><option value="newest">Recently added</option><option value="updated">Recently changed</option></select></label>
      <BaseButton class="ml-auto" variant="primary" @click="openCreate">＋ Add breed</BaseButton>
    </section>

    <p v-if="error" class="mb-3 flex justify-between gap-2 rounded-lg bg-[var(--danger)] p-2.5 text-sm text-white md:absolute md:top-16 md:right-7 md:left-7 md:z-2" role="alert">{{ error }} <button class="font-bold underline" @click="loadDogs">Try again</button></p>
    <DogTable :dogs="dogs" :loading="loading" @edit="openEdit" @delete="deleteDog" />
    <DogForm v-if="formOpen" :dog="formDog" :saving="saving" @close="closeForm" @save="saveDog" />
    <div v-if="toast" class="toast" role="status">{{ toast }}</div>
  </main>
</template>
