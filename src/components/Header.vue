<template>
  <a-layout-header 
    class="header-wrapper"
  >
    <div class="header-content">
      <!-- 欢迎文字 -->
      <span v-if="currentUser" class="welcome-text">
        欢迎，{{ currentUser.username }}
      </span>

      <!-- 退出按钮 -->
      <a-button 
        type="default" 
        v-if="currentUser" 
        class="logout-btn"
        @click="handleLogout"
      >
        <template #icon>
          <LogoutOutlined />
        </template>
        退出
      </a-button>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts" name="Header">
/**
 * 头部导航组件
 * 显示欢迎信息和退出按钮
 */
import { LogoutOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { logout } from '../api/loginApi';

/**
 * 当前用户接口
 */
interface CurrentUser {
  username: string; // 用户名
}

//  获取路由实例
const router = useRouter();

/**
 * 组件属性
 */
const props = defineProps<{
  currentUser: CurrentUser | null; // 当前登录用户信息
}>();

/**
 * 处理退出登录
 * 1. 调用logout API清除本地存储的用户信息
 * 2. 跳转到首页
 */
const handleLogout = () => {
  // 调用logout函数清除本地存储
  logout();
  
  // S跳转到首页
  router.push('/');
};
</script>

<style scoped>
.header-wrapper {
  padding: 0 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 64px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

/* 欢迎文字*/
.welcome-text {
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #a8d9d7, #f9b7c8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.3px;
}

/* 退出按钮 */
:deep(.logout-btn) {
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none !important;
  background: transparent !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 6px 12px !important;
}

:deep(.logout-btn:hover) {
  color: #333 !important;
  background: linear-gradient(135deg, #a8d9d7 60%, #f9b7c8 100%) !important;
  border-color: #a8d9d7 !important;
  box-shadow: 0 6px 28px rgba(168, 217, 215, 0.6), 0 0 40px rgba(168, 217, 215, 0.4) !important;
  transform: translateY(-2px) !important;
  animation: glow 1.2s ease-in-out infinite alternate !important;
  padding: 6px 12px !important;
  border-radius: 12px !important;
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