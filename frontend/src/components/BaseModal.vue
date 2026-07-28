<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  titleId: { type: String, required: true },
  descriptionId: { type: String, default: undefined },
  role: { type: String, default: 'dialog', validator: (value) => ['dialog', 'alertdialog'].includes(value) },
  closeDisabled: Boolean,
  panelClass: { type: String, default: 'max-w-[460px]' },
});
const emit = defineEmits(['close']);
const panel = ref(null);
const focusableSelector = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

let previouslyFocused;
let previousBodyOverflow;
let appRoot;
let previousInertValue;

function close() {
  if (!props.closeDisabled) emit('close');
}

function focusInitialControl() {
  const target = panel.value?.querySelector('[data-autofocus]') || panel.value?.querySelector(focusableSelector);
  (target || panel.value)?.focus();
}

function trapFocus(event) {
  const controls = [...panel.value.querySelectorAll(focusableSelector)];
  if (!controls.length) {
    event.preventDefault();
    panel.value.focus();
    return;
  }

  const first = controls[0];
  const last = controls[controls.length - 1];
  if (!panel.value.contains(document.activeElement)) {
    event.preventDefault();
    first.focus();
  } else if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

onMounted(async () => {
  previouslyFocused = document.activeElement;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  appRoot = document.getElementById('app');
  previousInertValue = appRoot?.getAttribute('inert');
  appRoot?.setAttribute('inert', '');

  await nextTick();
  focusInitialControl();
});

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow;
  if (appRoot) {
    if (previousInertValue === null) appRoot.removeAttribute('inert');
    else appRoot.setAttribute('inert', previousInertValue);
  }

  const focusTarget = previouslyFocused;
  nextTick(() => {
    if (focusTarget?.isConnected) focusTarget.focus();
  });
});
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-20 grid place-items-center overflow-y-auto bg-slate-950/60 p-5 backdrop-blur-sm"
      role="presentation"
      @click.self="close"
      @keydown.esc.prevent.stop="close"
      @keydown.tab="trapFocus"
    >
      <section
        ref="panel"
        :class="['my-auto w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_28px_90px_rgba(0,0,0,.32)]', panelClass]"
        :role="role"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="descriptionId"
        tabindex="-1"
      >
        <slot />
      </section>
    </div>
  </Teleport>
</template>
