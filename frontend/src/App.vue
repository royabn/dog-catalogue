<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import BaseButton from './components/BaseButton.vue';
import DeleteConfirmDialog from './components/DeleteConfirmDialog.vue';
import DogForm from './components/DogForm.vue';
import DogTable from './components/DogTable.vue';
import Pagination from './components/Pagination.vue';
import { useTheme } from './composables/useTheme.js';
import { dogsApi } from './services/api.js';
import { MAX_SEARCH_LENGTH, sanitizePlainText } from './utils/input.js';

const dogs = ref([]);
const loading = ref(true);
const saving = ref(false);
const sort = ref('name');
const search = ref('');
const activeSearch = ref('');
const page = ref(1);
const limit = ref(9);
const pagination = ref({ page: 1, limit: 9, total: 0, totalPages: 1 });
const formDog = ref(null);
const formOpen = ref(false);
const deleteTarget = ref(null);
const deleting = ref(false);
const toast = ref('');
const error = ref('');
const { isDark, toggleTheme } = useTheme();
let debounceTimer;
let latestRequest = 0;
let deleteReturnFocus;

async function loadDogs() {
  const requestId = ++latestRequest;
  loading.value = true;
  error.value = '';
  try {
    const response = await dogsApi.list({
      search: activeSearch.value,
      sort: sort.value,
      page: page.value,
      limit: limit.value,
    });
    if (requestId !== latestRequest) return;
    dogs.value = response.data;
    pagination.value = response.pagination;
    if (response.pagination.total > 0 && page.value > response.pagination.totalPages) {
      page.value = response.pagination.totalPages;
    }
  } catch (requestError) {
    if (requestId !== latestRequest) return;
    error.value = requestError.message;
  } finally {
    if (requestId === latestRequest) loading.value = false;
  }
}

function openCreate() { formDog.value = null; formOpen.value = true; }
function openEdit(dog) { formDog.value = dog; formOpen.value = true; }
function closeForm() { if (!saving.value) formOpen.value = false; }
function changePage(nextPage) {
  if (nextPage === page.value || nextPage < 1 || nextPage > pagination.value.totalPages) return;
  page.value = nextPage;
}
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
    page.value = 1;
    await loadDogs();
  } catch (requestError) {
    notify(requestError.message);
  } finally {
    saving.value = false;
  }
}

function requestDelete(dog, returnFocus) {
  deleteTarget.value = dog;
  deleteReturnFocus = returnFocus;
}

async function closeDeleteDialog() {
  if (deleting.value) return;
  deleteTarget.value = null;
  await nextTick();
  if (deleteReturnFocus?.isConnected) deleteReturnFocus.focus();
  deleteReturnFocus = null;
}

async function confirmDelete() {
  if (!deleteTarget.value || deleting.value) return;
  const dog = deleteTarget.value;
  deleting.value = true;
  try {
    await dogsApi.remove(dog._id);
    notify(`${dog.name} deleted`);
    deleteTarget.value = null;
    deleteReturnFocus = null;
    await loadDogs();
  } catch (requestError) {
    notify(requestError.message);
  } finally {
    deleting.value = false;
  }
}

watch(search, (value) => {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    activeSearch.value = sanitizePlainText(value).trim();
    page.value = 1;
  }, 300);
});

watch(sort, () => { page.value = 1; });
watch(limit, () => { page.value = 1; });
watch([sort, activeSearch, page, limit], loadDogs);
onMounted(loadDogs);
onBeforeUnmount(() => window.clearTimeout(debounceTimer));
</script>

<template>
  <main class="relative mx-auto max-w-290 px-4 pb-4 md:px-7">
    <header class="flex h-14 items-center justify-between">
      <a class="inline-flex items-center gap-2 font-bold tracking-tight text-[var(--text)] no-underline" href="/" aria-label="Dog Catalogue home"><span class="text-xl">🐾</span> Dog Catalogue</a>
      <button class="rounded-[10px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-px hover:bg-[var(--surface-muted)]" type="button" :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`" @click="toggleTheme">
        {{ isDark ? '☀ Light' : '☾ Dark' }}
      </button>
    </header>

    <section class="mb-4 grid gap-3 sm:grid-cols-[minmax(220px,1fr)_auto_auto] sm:items-center" aria-label="Catalogue controls">
      <label class="relative block">
        <span class="sr-only">Search breeds</span>
        <span class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted)]">⌕</span>
        <input v-model="search" class="w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface)] py-2.5 pr-10 pl-9 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-3 focus:ring-[color:color-mix(in_srgb,var(--primary)_16%,transparent)]" type="search" :maxlength="MAX_SEARCH_LENGTH" placeholder="Search breed or sub-breed…" autocomplete="off" />
        <button v-if="search" class="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]" type="button" aria-label="Clear search" @click="search = ''">×</button>
      </label>
      <label class="flex items-center gap-2 whitespace-nowrap text-sm text-[var(--muted)]">Sort <select v-model="sort" class="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--text)]" aria-label="Sort breeds"><option value="name">Name A–Z</option><option value="newest">Recently added</option><option value="updated">Recently changed</option></select></label>
      <BaseButton class="ml-auto" variant="primary" @click="openCreate">＋ Add breed</BaseButton>
    </section>

    <p v-if="error" class="mb-4 flex justify-between gap-2 rounded-lg bg-[var(--danger)] p-2.5 text-sm text-white" role="alert">{{ error }} <button class="font-bold underline" @click="loadDogs">Try again</button></p>
    <DogTable :dogs="dogs" :loading="loading" @edit="openEdit" @delete="requestDelete" />
    <Pagination
      :page="pagination.page"
      :total-pages="pagination.totalPages"
      :total="pagination.total"
      :limit="limit"
      @change="changePage"
      @update:limit="limit = $event"
    />
    <DogForm v-if="formOpen" :dog="formDog" :saving="saving" @close="closeForm" @save="saveDog" />
    <DeleteConfirmDialog
      v-if="deleteTarget"
      :dog="deleteTarget"
      :deleting="deleting"
      @cancel="closeDeleteDialog"
      @confirm="confirmDelete"
    />
    <div v-if="toast" class="toast" role="status">{{ toast }}</div>
  </main>
</template>
