<script setup>
import { ref, watch } from 'vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({ page: Number, totalPages: Number, total: Number });
const emit = defineEmits(['change']);
const targetPage = ref(props.page);

watch(() => props.page, (page) => { targetPage.value = page; });

function goToPage() {
  const page = Number(targetPage.value);
  if (!Number.isInteger(page) || page < 1) return;
  emit('change', Math.min(page, props.totalPages));
}
</script>

<template>
  <nav v-if="total" class="flex flex-col gap-3 pt-5 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between" aria-label="Pagination">
    <p class="m-0">{{ total }} breed{{ total === 1 ? '' : 's' }} total</p>
    <div class="flex items-center justify-between gap-2 md:justify-start">
      <BaseButton variant="quiet" :disabled="page <= 1" @click="emit('change', page - 1)">← Previous</BaseButton>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <BaseButton variant="quiet" :disabled="page >= totalPages" @click="emit('change', page + 1)">Next →</BaseButton>
    </div>
    <form v-if="totalPages > 1" class="flex items-center justify-end gap-2 whitespace-nowrap" @submit.prevent="goToPage">
      <label for="page-number">Go to</label>
      <input id="page-number" v-model="targetPage" class="w-12 rounded-md border border-[var(--line)] bg-[var(--surface)] p-1.5 text-center text-[var(--text)]" type="number" min="1" :max="totalPages" inputmode="numeric" />
      <BaseButton variant="quiet" type="submit">Go</BaseButton>
    </form>
  </nav>
</template>
