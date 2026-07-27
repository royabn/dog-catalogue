<script setup>
defineProps({ dogs: { type: Array, required: true }, loading: Boolean });
defineEmits(['edit', 'delete']);

function label(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
</script>

<template>
  <section class="min-h-0 md:overflow-hidden" aria-live="polite" aria-busy="loading">
    <div v-if="loading" class="flex min-h-72 items-center justify-center gap-2 text-[var(--muted)]"><span class="size-[18px] animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--primary)]"></span>Loading breeds…</div>
    <div v-else-if="!dogs.length" class="grid min-h-72 place-content-center justify-items-center text-center text-[var(--muted)]">
      <span class="mb-2.5 grid size-[52px] place-items-center rounded-full bg-[var(--tag)] text-2xl text-[var(--primary)]">⌕</span>
      <h2 class="mb-1 text-base font-bold text-[var(--text)]">No breeds found</h2>
      <p class="m-0 max-w-75 leading-6">Try a different search, or add a new breed to the catalogue.</p>
    </div>
    <ul v-else class="m-0 grid list-none grid-cols-1 gap-4 p-0 md:h-full md:auto-rows-fr md:grid-cols-2 xl:grid-cols-3">
      <li v-for="dog in dogs" :key="dog._id" class="dog-card min-h-41 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-[18px] shadow-[0_2px_5px_rgba(20,33,61,.02)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)] md:min-h-0 md:overflow-auto">
        <div class="flex items-start gap-2.5">
          <span class="grid size-[37px] shrink-0 place-items-center rounded-[10px] bg-[var(--surface-muted)]" aria-hidden="true">🐕</span>
          <div>
            <h2 class="mb-0.5 text-base font-bold tracking-tight">{{ label(dog.name) }}</h2>
            <p class="m-0 text-[.81rem] text-[var(--muted)]">{{ dog.subBreeds.length ? `${dog.subBreeds.length} variation${dog.subBreeds.length === 1 ? '' : 's'}` : 'No variations' }}</p>
          </div>
          <div class="ml-auto flex gap-1.5 opacity-50 transition hover:opacity-100 focus-within:opacity-100">
            <button class="grid size-[30px] place-items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition hover:-translate-y-px hover:bg-[var(--surface-muted)]" type="button" :aria-label="`Edit ${label(dog.name)}`" @click="$emit('edit', dog)">✎</button>
            <button class="grid size-[30px] place-items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--danger)] transition hover:-translate-y-px hover:border-[color:color-mix(in_srgb,var(--danger)_50%,var(--line))] hover:bg-[var(--surface-muted)]" type="button" :aria-label="`Delete ${label(dog.name)}`" @click="$emit('delete', dog)">⌫</button>
          </div>
        </div>
        <div v-if="dog.subBreeds.length" class="dog-card-tags mt-[18px] flex flex-wrap gap-1.5">
          <span v-for="subBreed in dog.subBreeds" :key="subBreed" class="dog-card-tag rounded bg-[var(--tag)] px-1.75 py-1 text-[.72rem] font-bold text-[var(--primary)]">{{ label(subBreed) }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>
