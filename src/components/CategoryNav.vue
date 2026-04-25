<template>
  <div class="category-nav">
    <div class="category-grid">
      <div
        v-for="category in categories"
        :key="category.key"
        class="category-pill"
        :class="{ active: selected === category.name }"
        @click="handleCategoryClick(category.name)"
      >
        {{ category.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  key: string;
  name: string;
}

const props = defineProps({
  categories: {
    type: Array as () => Category[],
    default: () => [],
  },
  selected: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["categoryClick"]);

const handleCategoryClick = (category: string) => {
  emit("categoryClick", category);
};
</script>

<style scoped>
.category-nav {
  margin-bottom: 28px;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.category-pill {
  display: inline-block;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 60px;
  border: 1px solid rgba(24, 144, 255, 0.2);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  transition: all 0.25s ease;
  text-align: center;
}

/* 随机轻微倾斜，生动而不规则 */
.category-pill:nth-child(odd) {
  transform: rotate(-0.5deg);
}
.category-pill:nth-child(even) {
  transform: rotate(0.5deg);
}
.category-pill:nth-child(3n) {
  transform: rotate(0.2deg);
}
.category-pill:nth-child(5n) {
  transform: rotate(-0.3deg);
}

.category-pill:hover {
  transform: translateY(-3px) rotate(0deg) scale(1.02);
  background: #e6f7ff;
  border-color: #40a9ff;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.15);
}

.category-pill.active {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  border-color: transparent;
  color: white;
  box-shadow: 0 6px 12px rgba(24, 144, 255, 0.3);
  transform: translateY(-2px) scale(1.02);
}
</style>