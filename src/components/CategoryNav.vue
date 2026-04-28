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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  border-radius: 60px;
  border: 1px solid rgba(168, 217, 215, 0.2);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  transition: all 0.28s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* 轻微倾斜效果 */
.category-pill:nth-child(odd) {
  transform: rotate(-0.5deg);
}
.category-pill:nth-child(even) {
  transform: rotate(0.5deg);
}

/* 淡色柔和悬停：淡蓝紫光泽 + 轻微发光 */
.category-pill:hover {
  transform: translateY(-2px) rotate(0deg) scale(1.02);
  background: linear-gradient(135deg, #a8d9d7 60%, #f9b7c8 100%);
  border-color: #a8d9d7;
  box-shadow: 0 6px 28px rgba(168, 217, 215, 0.6), 0 0 40px rgba(168, 217, 215, 0.4);
  color: #333;
  animation: glow 1.2s ease-in-out infinite alternate;
}

/* 淡淡的光泽扫过 */
.category-pill:hover::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  animation: sheen 0.5s ease forwards;
}

@keyframes sheen {
  100% { left: 100%; }
}

/* 发光动画 */
@keyframes glow {
  from {
    box-shadow: 0 6px 28px rgba(168, 217, 215, 0.6), 0 0 40px rgba(168, 217, 215, 0.4);
  }
  to {
    box-shadow: 0 6px 32px rgba(168, 217, 215, 0.8), 0 0 50px rgba(168, 217, 215, 0.6), 0 0 60px rgba(168, 217, 215, 0.3);
  }
}

/* 选中：淡蓝紫色渐变，不浓 */
.category-pill.active {
  background: linear-gradient(135deg, #a8d9d7 60%, #f9b7c8 100%);
  border-color: #a8d9d7;
  color: #333;
  box-shadow: 0 6px 28px rgba(168, 217, 215, 0.6), 0 0 40px rgba(168, 217, 215, 0.4);
  transform: translateY(-2px) scale(1.02);
  animation: glow 1.2s ease-in-out infinite alternate;
}
</style>