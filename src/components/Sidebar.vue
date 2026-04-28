<template>
  <a-layout-sider
    :collapsed="collapsed"
    @update:collapsed="emit('update:collapsed', $event)"
    collapsible
    class="custom-sider"
  >
    <!-- Logo 区域：项目名称 + 浅色背景 -->
    <div class="logo">
      <h2 v-if="!collapsed">电影管理系统</h2>
      <h2 v-else>影</h2>
    </div>

    <a-menu
      :selectedKeys="selectedKeys"
      @update:selectedKeys="handleSelectedKeysChange"
      mode="inline"
    >
      <a-menu-item v-for="(item, index) in menuItems" :key="String(index + 1)">
        <component :is="item.icon" />
        <span>{{ item.title }}</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts" name="Sidebar">
/**
 * 侧边栏组件
 * 显示项目Logo和导航菜单
 * 根据用户类型（admin/user）显示不同的菜单选项
 */
import { computed } from 'vue';
import {
  HomeOutlined,
  PieChartOutlined,
  UserOutlined,
  UserOutlined as UserIcon,
  DesktopOutlined,
} from '@ant-design/icons-vue';

/**
 * 菜单项接口
 */
interface MenuItem {
  title: string; // 菜单标题
  icon: any; // 菜单图标
}

/**
 * 组件属性
 */
const props = defineProps<{
  collapsed: boolean; // 侧边栏是否折叠
  selectedKeys: string[]; // 选中的菜单键
  type: 'user' | 'admin'; // 用户类型：admin-管理员，user-普通用户
}>();

/**
 * 组件事件
 */
const emit = defineEmits<{
  'update:collapsed': [value: boolean]; // 侧边栏折叠状态变更
  'update:selectedKeys': [keys: string[]]; // 选中菜单键变更
}>();

/**
 * 处理选中菜单键变更
 * @param keys 新的选中键
 */
const handleSelectedKeysChange = (keys: string[]) => {
  // Step 1: 获取当前菜单的所有有效键
  // 将菜单项的索引转换为字符串键（1, 2, 3...）
  const validKeys = menuItems.value.map((_, index) => String(index + 1));
  
  // Step 2: 过滤传入的选中键，只保留有效的键
  // 确保不会选中不存在的菜单项
  const newKeys = keys.filter(key => validKeys.includes(key));

  // Step 3: 如果有有效的新键，触发更新事件
  if (newKeys.length > 0) {
    emit('update:selectedKeys', newKeys);
  } 
  // Step 4: 如果没有有效新键但当前有选中项，保持当前选中状态
  // 防止侧边栏在没有任何选中项的情况下显示
  else if (props.selectedKeys.length > 0) {
    emit('update:selectedKeys', props.selectedKeys);
  }
};

/**
 * 计算菜单项
 * 根据用户类型返回不同的菜单配置
 * - admin: 显示用户管理、电影数据管理
 * - user: 显示首页、电影分析图表、个人信息
 */
const menuItems = computed<MenuItem[]>(() => {
  // 判断用户类型
  if (props.type === 'admin') {
    // 管理员菜单：用户管理、电影数据管理
    return [
      { title: '用户管理', icon: UserIcon },
      { title: '电影数据管理', icon: DesktopOutlined },
    ];
  } else {
    // 普通用户菜单：首页、电影分析图表、个人信息
    return [
      { title: '首页', icon: HomeOutlined },
      { title: '电影分析图表', icon: PieChartOutlined },
      { title: '个人信息', icon: UserOutlined },
    ];
  }
});
</script>

<style scoped>
/* 侧边栏整体样式：和你的页面风格匹配 */
.custom-sider {
  background: #ffffff !important;
  border-right: 1px solid #e8e8e8;
}

/* Logo 区域：不要填充，只保留文字颜色 */
.logo {
  height: 60px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  font-size: 18px;
  font-weight: bold;
}

.logo h2 {
  margin: 0;
  padding: 0;
  font-size: 20px;
  background: linear-gradient(135deg, #a8d9d7 0%, #f9b7c8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 重点：美化默认的收起按钮，不再是丑丑的占满背景 */
:deep(.ant-layout-sider-trigger) {
  background: #ffffff !important;
  border-top: 1px solid #e8e8e8;
  color: #333 !important;
  height: 48px;
  line-height: 48px;
  transition: all 0.3s;
}

:deep(.ant-layout-sider-trigger:hover) {
  background: linear-gradient(135deg, #a8d9d7 60%, #f9b7c8 100%) !important;
  color: #333 !important;
  box-shadow: 0 6px 28px rgba(168, 217, 215, 0.6), 0 0 40px rgba(168, 217, 215, 0.4) !important;
  transform: translateY(-2px) !important;
  animation: glow 1.2s ease-in-out infinite alternate !important;
}

/* 菜单样式适配浅色背景 */
:deep(.ant-menu) {
  background: #ffffff !important;
}

:deep(.ant-menu-item) {
  color: #333 !important;
  border-radius: 12px !important;
  margin: 8px 12px !important;
  transition: all 0.3s ease !important;
  font-weight: 500 !important;
  padding: 12px 16px !important;
  background: rgba(255, 255, 255, 0.6) !important;
  border: none !important;
}

:deep(.ant-menu-item:hover) {
  background: linear-gradient(135deg, #a8d9d7 60%, #f9b7c8 100%) !important;
  transform: translateX(6px) !important;
  box-shadow: 0 6px 28px rgba(168, 217, 215, 0.6), 0 0 40px rgba(168, 217, 215, 0.4) !important;
  border: 1px solid #a8d9d7 !important;
  animation: glow 1.2s ease-in-out infinite alternate !important;
}

:deep(.ant-menu-item:hover .ant-menu-title-content) {
  color: #333 !important;
  font-weight: 600 !important;
  text-shadow: 0 0 12px rgba(168, 217, 215, 0.9) !important;
}

:deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, #a8d9d7 60%, #f9b7c8 100%) !important;
  box-shadow: 0 6px 28px rgba(168, 217, 215, 0.6), 0 0 40px rgba(168, 217, 215, 0.4) !important;
  border: 1px solid #a8d9d7 !important;
  transform: translateX(6px) !important;
  animation: glow 1.2s ease-in-out infinite alternate !important;
}

:deep(.ant-menu-item-selected .ant-menu-title-content) {
  color: #333 !important;
  font-weight: 600 !important;
}

:deep(.ant-menu-item-selected .ant-menu-item-icon) {
  color: #333 !important;
  font-size: 18px !important;
  margin-right: 12px !important;
}

:deep(.ant-menu-item-icon) {
  color: #333 !important;
  font-size: 18px !important;
  margin-right: 12px !important;
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
</style>