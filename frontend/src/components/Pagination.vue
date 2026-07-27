<script setup>
import { ref, watch } from 'vue';
import BaseButton from './BaseButton.vue';

const props = defineProps({
  page: Number,
  totalPages: Number,
  total: Number,
  limit: Number,
});
const emit = defineEmits(['change', 'update:limit']);
const targetPage = ref(props.page);

watch(() => props.page, (page) => { targetPage.value = page; });

function goToPage() {
  const page = Number(targetPage.value);
  if (!Number.isInteger(page) || page < 1) return;
  emit('change', Math.min(page, props.totalPages));
}
</script>

<template>
  <nav v-if="total" class="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 pt-4 text-sm text-[var(--muted)] lg:flex-nowrap" aria-label="Pagination">
    <p class="m-0 whitespace-nowrap">{{ total }} breed{{ total === 1 ? '' : 's' }} total</p>
    <div class="flex items-center gap-2 whitespace-nowrap">
      <BaseButton variant="quiet" :disabled="page <= 1" @click="emit('change', page - 1)">← Previous</BaseButton>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <BaseButton variant="quiet" :disabled="page >= totalPages" @click="emit('change', page + 1)">Next →</BaseButton>
    </div>
    <form v-if="totalPages > 1" class="flex items-center justify-end gap-2 whitespace-nowrap" @submit.prevent="goToPage">
      <label for="page-number">Go to</label>
      <input id="page-number" v-model="targetPage" class="w-12 rounded-md border border-[var(--line)] bg-[var(--surface)] p-1.5 text-center text-[var(--text)]" type="number" min="1" :max="totalPages" inputmode="numeric" />
      <BaseButton variant="quiet" type="submit">Go</BaseButton>
    </form>
    <label class="flex items-center gap-2 whitespace-nowrap">
      Show
      <select
        :value="limit"
        class="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-1.5 text-[var(--text)]"
        aria-label="Breeds per page"
        @change="emit('update:limit', Number($event.target.value))"
      >
        <option :value="6">6</option>
        <option :value="9">9</option>
        <option :value="12">12</option>
        <option :value="24">24</option>
      </select>
      per page
    </label>
  </nav>
</template>
