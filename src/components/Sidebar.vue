<template>
  <a-layout-sider :collapsed="collapsed" @update:collapsed="emit('update:collapsed', $event)" collapsible>
    <div class="logo" />
    <a-menu :selectedKeys="selectedKeys" @update:selectedKeys="handleSelectedKeysChange" theme="dark" mode="inline">
      <a-menu-item v-for="(item, index) in menuItems" :key="String(index + 1)">
        <component :is="item.icon" />
        <span>{{ item.title }}</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HomeOutlined, PieChartOutlined, UserOutlined, UserOutlined as UserIcon, DesktopOutlined } from '@ant-design/icons-vue';

interface MenuItem {
  title: string;
  icon: any;
}

const props = defineProps<{
  collapsed: boolean;
  selectedKeys: string[];
  type: 'user' | 'admin';
}>();

const emit = defineEmits<{
  'update:collapsed': [value: boolean];
  'update:selectedKeys': [keys: string[]];
}>();

// 处理选中项变化，防止意外跳回首页
const handleSelectedKeysChange = (keys: string[]) => {
  // 确保只有有效的菜单key才会被更新
  const validKeys = menuItems.value.map((_, index) => String(index + 1));
  const newKeys = keys.filter(key => validKeys.includes(key));
  
  if (newKeys.length > 0) {
    emit('update:selectedKeys', newKeys);
  } else if (props.selectedKeys.length > 0) {
    // 如果没有有效key，保持原有的选中状态
    emit('update:selectedKeys', props.selectedKeys);
  }
};

// 根据类型生成菜单项
const menuItems = computed<MenuItem[]>(() => {
  if (props.type === 'admin') {
    return [
      { title: '用户管理', icon: UserIcon },
      { title: '电影数据管理', icon: DesktopOutlined }
    ];
  } else {
    return [
      { title: '首页', icon: HomeOutlined },
      { title: '电影分析图表', icon: PieChartOutlined },
      { title: '个人信息', icon: UserOutlined }
    ];
  }
});
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}
</style>