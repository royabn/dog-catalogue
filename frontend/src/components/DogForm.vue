<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';
import { MAX_BREED_LENGTH, MAX_SUB_BREED_INPUT_LENGTH, MAX_SUB_BREEDS, parseSubBreeds, sanitizePlainText } from '../utils/input.js';

const props = defineProps({
  dog: { type: Object, default: null },
  saving: Boolean,
  serverErrors: { type: Object, default: () => ({}) },
});
const emit = defineEmits(['close', 'save']);
const name = ref('');
const subBreedText = ref('');
const errors = ref({});
const nameInput = ref(null);
const subBreedInput = ref(null);
const title = computed(() => props.dog ? 'Edit breed' : 'Add a breed');
const nameLength = computed(() => name.value.length);
const subBreedTextLength = computed(() => subBreedText.value.length);

function reset() {
  name.value = props.dog?.name || '';
  subBreedText.value = props.dog?.subBreeds?.join(', ') || '';
  errors.value = {};
}

watch(() => props.dog, reset, { immediate: true });
watch(() => props.serverErrors, async (serverErrors) => {
  errors.value = Object.fromEntries(
    Object.entries(serverErrors).map(([field, messages]) => [field, Array.isArray(messages) ? messages[0] : String(messages)])
  );
  await focusFirstError();
});

function clearError(field) {
  if (!errors.value[field]) return;
  const nextErrors = { ...errors.value };
  delete nextErrors[field];
  errors.value = nextErrors;
}

function updateName() {
  name.value = sanitizePlainText(name.value);
  clearError('name');
}

function updateSubBreeds() {
  subBreedText.value = sanitizePlainText(subBreedText.value);
  clearError('subBreeds');
}

async function focusFirstError() {
  await nextTick();
  if (errors.value.name) nameInput.value?.focus();
  else if (errors.value.subBreeds) subBreedInput.value?.focus();
}

async function submit() {
  const subBreeds = parseSubBreeds(subBreedText.value);
  errors.value = {};
  if (!name.value.trim()) errors.value.name = 'Enter a breed name.';
  if (name.value.trim().length > MAX_BREED_LENGTH) errors.value.name = `Breed names can be at most ${MAX_BREED_LENGTH} characters.`;
  if (subBreeds.length > MAX_SUB_BREEDS) errors.value.subBreeds = `Add at most ${MAX_SUB_BREEDS} sub-breeds.`;
  if (subBreeds.some((value) => value.length > MAX_BREED_LENGTH)) errors.value.subBreeds = `Each sub-breed can be at most ${MAX_BREED_LENGTH} characters.`;
  if (new Set(subBreeds.map((value) => value.toLowerCase())).size !== subBreeds.length) errors.value.subBreeds = 'Sub-breeds must be unique.';
  if (Object.keys(errors.value).length) {
    await focusFirstError();
    return;
  }
  emit('save', { name: sanitizePlainText(name.value).trim(), subBreeds });
}
</script>

<template>
  <BaseModal title-id="dog-form-title" :close-disabled="saving" @close="emit('close')">
    <header class="mb-6 flex items-start justify-between gap-4">
      <div>
        <p class="mb-2 text-xs font-extrabold tracking-[.12em] text-[var(--primary)] uppercase">Catalogue editor</p>
        <h2 id="dog-form-title" class="m-0 text-[1.35rem] font-bold tracking-[-.04em]">{{ title }}</h2>
      </div>
      <button class="grid size-8 place-items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-lg text-[var(--text)] transition hover:-translate-y-px hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-55" type="button" aria-label="Close dialog" :disabled="saving" @click="emit('close')">×</button>
    </header>
    <form class="grid gap-4" @submit.prevent="submit">
      <label class="grid gap-2 text-sm font-bold">
        Breed name
        <input ref="nameInput" v-model="name" data-autofocus class="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2.5 text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-3 focus:ring-[color:color-mix(in_srgb,var(--primary)_16%,transparent)]" :aria-invalid="Boolean(errors.name)" :aria-describedby="errors.name ? 'name-count name-error' : 'name-count'" :maxlength="MAX_BREED_LENGTH" placeholder="e.g. Labrador" @input="updateName" />
        <small id="name-count" class="text-xs font-medium text-[var(--muted)]">{{ nameLength }}/{{ MAX_BREED_LENGTH }}</small>
        <small v-if="errors.name" id="name-error" class="text-xs text-[var(--danger)]" role="alert">{{ errors.name }}</small>
      </label>
      <label class="grid gap-2 text-sm font-bold">
        Sub-breeds <span class="text-xs font-medium text-[var(--muted)]">optional</span>
        <input ref="subBreedInput" v-model="subBreedText" class="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2.5 text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-3 focus:ring-[color:color-mix(in_srgb,var(--primary)_16%,transparent)]" :aria-invalid="Boolean(errors.subBreeds)" :aria-describedby="errors.subBreeds ? 'sub-breed-help sub-breed-error' : 'sub-breed-help'" :maxlength="MAX_SUB_BREED_INPUT_LENGTH" placeholder="e.g. golden, flatcoated" @input="updateSubBreeds" />
        <small id="sub-breed-help" class="text-xs font-medium text-[var(--muted)]">Separate multiple sub-breeds with commas. {{ subBreedTextLength }}/{{ MAX_SUB_BREED_INPUT_LENGTH }}</small>
        <small v-if="errors.subBreeds" id="sub-breed-error" class="text-xs text-[var(--danger)]" role="alert">{{ errors.subBreeds }}</small>
      </label>
      <footer class="mt-1 flex justify-end gap-2">
        <BaseButton variant="quiet" type="button" @click="emit('close')">Cancel</BaseButton>
        <BaseButton variant="primary" type="submit" :disabled="saving">{{ saving ? 'Saving…' : 'Save breed' }}</BaseButton>
      </footer>
    </form>
  </BaseModal>
</template>
