import { computed, ref, watch } from 'vue';

const storedTheme = localStorage.getItem('dog-catalogue-theme');
const theme = ref(storedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

watch(theme, (value) => {
  document.documentElement.dataset.theme = value;
  localStorage.setItem('dog-catalogue-theme', value);
}, { immediate: true });

export function useTheme() {
  return {
    isDark: computed(() => theme.value === 'dark'),
    toggleTheme: () => { theme.value = theme.value === 'dark' ? 'light' : 'dark'; },
  };
}
