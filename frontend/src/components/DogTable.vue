<script setup>
defineProps({ dogs: { type: Array, required: true }, loading: Boolean });
defineEmits(['edit', 'delete', 'details']);

const previewLimit = 2;

function label(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
</script>

<template>
  <section class="pb-4" aria-live="polite" :aria-busy="loading">
    <div v-if="loading" class="flex min-h-72 items-center justify-center gap-2 text-[var(--muted)]"><span class="size-[18px] animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--primary)]"></span>Loading breeds…</div>
    <div v-else-if="!dogs.length" class="grid min-h-72 place-content-center justify-items-center text-center text-[var(--muted)]">
      <span class="mb-2.5 grid size-[52px] place-items-center rounded-full bg-[var(--tag)] text-2xl text-[var(--primary)]">⌕</span>
      <h2 class="mb-1 text-base font-bold text-[var(--text)]">No breeds found</h2>
      <p class="m-0 max-w-75 leading-6">Try a different search, or add a new breed to the catalogue.</p>
    </div>
    <ul v-else class="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
      <li v-for="dog in dogs" :key="dog._id" class="dog-card flex h-36 flex-col rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_2px_5px_rgba(20,33,61,.02)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]">
        <div class="flex items-start gap-2.5">
          <span class="grid size-[37px] shrink-0 place-items-center rounded-[10px] bg-[var(--surface-muted)]" aria-hidden="true">🐕</span>
          <div class="min-w-0">
            <h2 class="mb-0.5 truncate text-base font-bold tracking-tight" :title="label(dog.name)">{{ label(dog.name) }}</h2>
            <p class="m-0 text-[.81rem] text-[var(--muted)]">{{ dog.subBreeds.length ? `${dog.subBreeds.length} variation${dog.subBreeds.length === 1 ? '' : 's'}` : 'No variations' }}</p>
          </div>
          <div class="ml-auto flex gap-1.5 opacity-50 transition hover:opacity-100 focus-within:opacity-100">
            <button class="grid size-[30px] place-items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition hover:-translate-y-px hover:bg-[var(--surface-muted)]" type="button" :aria-label="`Edit ${label(dog.name)}`" :title="`Edit ${label(dog.name)}`" @click="$emit('edit', dog)">✎</button>
            <button class="grid size-[30px] place-items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--danger)] transition hover:-translate-y-px hover:border-[color:color-mix(in_srgb,var(--danger)_50%,var(--line))] hover:bg-[var(--surface-muted)]" type="button" :aria-label="`Delete ${label(dog.name)}`" :title="`Delete ${label(dog.name)}`" @click="$emit('delete', dog)">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="m19 6-1 14H6L5 6" />
                <path d="M10 11v5M14 11v5" />
              </svg>
            </button>
          </div>
        </div>
        <div v-if="dog.subBreeds.length" class="dog-card-tags mt-auto flex min-w-0 items-center gap-1.5 overflow-hidden">
          <span
            v-for="subBreed in dog.subBreeds.slice(0, previewLimit)"
            :key="subBreed"
            class="dog-card-tag max-w-30 truncate rounded bg-[var(--tag)] px-1.75 py-1 text-[.72rem] font-bold text-[var(--primary)]"
            :title="label(subBreed)"
          >{{ label(subBreed) }}</span>
          <button
            v-if="dog.subBreeds.length > previewLimit"
            class="shrink-0 rounded-md border border-[var(--line)] bg-[var(--surface-muted)] px-2 py-1 text-[.72rem] font-bold text-[var(--primary)] transition hover:bg-[var(--tag)]"
            type="button"
            :aria-label="`View all ${dog.subBreeds.length} sub-breeds for ${label(dog.name)}`"
            @click="$emit('details', dog)"
          >+{{ dog.subBreeds.length - previewLimit }} more</button>
        </div>
        <p v-else class="mt-auto mb-0 text-xs text-[var(--muted)]">No sub-breeds to display</p>
      </li>
    </ul>
  </section>
</template>
