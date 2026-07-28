<script setup>
import { computed } from 'vue';
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({ dog: { type: Object, required: true } });
const emit = defineEmits(['close']);
const dogName = computed(() => label(props.dog.name));

function label(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
</script>

<template>
  <BaseModal
    title-id="dog-details-title"
    description-id="dog-details-description"
    panel-class="max-w-[560px]"
    @close="emit('close')"
  >
    <header class="mb-5 flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="mb-2 text-xs font-extrabold tracking-[.12em] text-[var(--primary)] uppercase">Breed details</p>
        <h2 id="dog-details-title" class="m-0 text-[1.35rem] font-bold tracking-[-.04em]">{{ dogName }}</h2>
        <p id="dog-details-description" class="mt-1.5 mb-0 text-sm text-[var(--muted)]">
          {{ dog.subBreeds.length }} sub-breed{{ dog.subBreeds.length === 1 ? '' : 's' }}
        </p>
      </div>
      <button data-autofocus class="grid size-8 shrink-0 place-items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-lg text-[var(--text)] transition hover:-translate-y-px hover:bg-[var(--surface-muted)]" type="button" aria-label="Close breed details" @click="emit('close')">×</button>
    </header>

    <ul v-if="dog.subBreeds.length" class="m-0 grid max-h-[55vh] list-none grid-cols-1 gap-2 overflow-y-auto p-0 pr-1 sm:grid-cols-2">
      <li v-for="subBreed in dog.subBreeds" :key="subBreed" class="rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2.5 text-sm font-semibold">
        {{ label(subBreed) }}
      </li>
    </ul>
    <p v-else class="rounded-lg bg-[var(--surface-muted)] p-4 text-sm text-[var(--muted)]">No sub-breeds have been added.</p>

    <footer class="mt-5 flex justify-end">
      <BaseButton variant="primary" @click="emit('close')">Done</BaseButton>
    </footer>
  </BaseModal>
</template>
