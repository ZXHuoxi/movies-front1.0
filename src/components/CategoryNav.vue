<template>
  <div class="category-nav">
    <a-row :gutter="[12, 12]" justify="start">
      <a-col
        v-for="category in categories"
        :key="category.key"
        :xs="6"
        :sm="4"
        :md="3"
        :lg="2"
      >
        <!-- 高级感卡片按钮 -->
        <a-card
          hoverable
          class="category-card"
          :class="{ active: selected === category.name }"
          @click="handleCategoryClick(category.name)"
        >
          <div class="category-text">{{ category.name }}</div>
        </a-card>
      </a-col>
    </a-row>
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
  // 接收当前选中的分类
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
/* 整体布局 */
.category-nav {
  margin-bottom: 28px;
}

/* 分类卡片样式 */
:deep(.category-card) {
  text-align: center;
  border-radius: 14px;
  cursor: pointer;
  border: none;
  background: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* 悬停效果：高级光泽 + 上浮 */
:deep(.category-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(24, 144, 255, 0.15);
  background: #e6f7ff;
}

/* 选中状态：渐变蓝 + 高级发光 */
:deep(.category-card.active) {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  color: #fff;
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3);
}

/* 文字样式 */
.category-text {
  font-size: 14px;
  font-weight: 500;
  padding: 6px 0;
}

/* 选中时文字变白 */
:deep(.category-card.active) .category-text {
  color: #ffffff;
}
</style>