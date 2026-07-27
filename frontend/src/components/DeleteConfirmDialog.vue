<script setup>
import { computed, onMounted, ref } from 'vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({
  dog: { type: Object, required: true },
  deleting: Boolean,
});
const emit = defineEmits(['cancel', 'confirm']);
const dialog = ref(null);
const cancelButton = ref(null);
const dogName = computed(() => props.dog.name.replace(/\b\w/g, (letter) => letter.toUpperCase()));

onMounted(() => cancelButton.value?.$el?.focus());

function cancel() {
  if (!props.deleting) emit('cancel');
}

function keepFocusInside(event) {
  const controls = [...dialog.value.querySelectorAll('button:not(:disabled)')];
  if (!controls.length) return;
  const first = controls[0];
  const last = controls[controls.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-20 grid place-items-center bg-slate-950/60 p-5 backdrop-blur-sm"
      role="presentation"
      @click.self="cancel"
      @keydown.esc.prevent="cancel"
      @keydown.tab="keepFocusInside"
    >
      <section
        ref="dialog"
        class="w-full max-w-[430px] rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_28px_90px_rgba(0,0,0,.32)]"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
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
          <BaseButton ref="cancelButton" variant="quiet" :disabled="deleting" @click="cancel">Cancel</BaseButton>
          <BaseButton variant="danger" :disabled="deleting" @click="emit('confirm')">
            {{ deleting ? 'Deleting…' : 'Delete breed' }}
          </BaseButton>
        </footer>
      </section>
    </div>
  </Teleport>
</template>
