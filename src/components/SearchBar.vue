<template>
  <a-input-search
    v-model:value="keyword"
    placeholder="搜索"
    style="width: 300px;"
    @search="handleSearch"
    enter-button
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits<{
  // 可复用的搜索框
  'update:modelValue': [value: string];
  'search': [keyword: string];
  'clear': [];
}>();

const keyword = ref(props.modelValue);
// 内部变 → 同步给父组件
watch(keyword, (newValue) => {
  emit('update:modelValue', newValue);
});
// 父组件变 → 同步给内部
watch(() => props.modelValue, (newValue) => {
  keyword.value = newValue;
});

const handleSearch = (value?: string) => {
  const searchValue = value || keyword.value;
  emit('search', searchValue);
};
</script>