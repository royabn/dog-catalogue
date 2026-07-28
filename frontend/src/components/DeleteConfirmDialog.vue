<script setup>
import { computed } from 'vue';
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({
  dog: { type: Object, required: true },
  deleting: Boolean,
});
const emit = defineEmits(['cancel', 'confirm']);
const dogName = computed(() => props.dog.name.replace(/\b\w/g, (letter) => letter.toUpperCase()));

function cancel() {
  if (!props.deleting) emit('cancel');
}
</script>

<template>
  <BaseModal
    title-id="delete-dialog-title"
    description-id="delete-dialog-description"
    role="alertdialog"
    panel-class="max-w-[430px]"
    :close-disabled="deleting"
    @close="cancel"
  >
    <div class="mb-5 flex items-start gap-4">
      <span class="grid size-11 shrink-0 place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--danger)_13%,transparent)] text-[var(--danger)]" aria-hidden="true">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="m19 6-1 14H6L5 6" />
          <path d="M10 11v5M14 11v5" />
        </svg>
      </span>
      <div>
        <h2 id="delete-dialog-title" class="m-0 text-lg font-bold tracking-tight">Delete {{ dogName }}?</h2>
        <p id="delete-dialog-description" class="mt-2 mb-0 text-sm leading-6 text-[var(--muted)]">
          This will permanently remove the breed and all of its sub-breeds. This action cannot be undone.
        </p>
      </div>
    </div>
    <footer class="flex justify-end gap-2">
      <BaseButton data-autofocus variant="quiet" :disabled="deleting" @click="cancel">Cancel</BaseButton>
      <BaseButton variant="danger" :disabled="deleting" @click="emit('confirm')">
        {{ deleting ? 'Deleting…' : 'Delete breed' }}
      </BaseButton>
    </footer>
  </BaseModal>
</template>
