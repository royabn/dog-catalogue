<script setup>
defineProps({
  variant: { type: String, default: 'quiet', validator: (value) => ['primary', 'quiet', 'danger'].includes(value) },
  type: { type: String, default: 'button' },
});
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-bold transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[color:color-mix(in_srgb,var(--primary)_45%,transparent)]',
      variant === 'primary' && 'bg-[var(--primary)] text-white shadow-[0_7px_18px_color-mix(in_srgb,var(--primary)_25%,transparent)] hover:bg-[var(--primary-dark)]',
      variant === 'danger' && 'bg-[#b42318] text-white shadow-[0_7px_18px_rgba(180,35,24,.2)] hover:bg-[#912018]',
      variant === 'quiet' && 'border border-[var(--line)] bg-[var(--surface-muted)] text-[var(--text)] hover:bg-[var(--surface)]',
    ]"
    :type="type"
  ><slot /></button>
</template>
