<template>
  <a-layout-header 
    class="header-wrapper"
    style="background: #fff; padding: 0; display: flex; justify-content: flex-end; align-items: center; padding-right: 24px;"
  >
    <div class="header-content">
      <!-- 欢迎文字 -->
      <span v-if="currentUser" class="welcome-text">
        欢迎，{{ currentUser.username }}
      </span>

      <!-- 退出按钮 -->
      <a-button 
        type="text" 
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

<script setup lang="ts">
import { LogoutOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { logout } from '../api/loginApi';

interface CurrentUser {
  username: string;
}

const router = useRouter();

const props = defineProps<{
  currentUser: CurrentUser | null;
}>();

const handleLogout = () => {
  logout();
  router.push('/');
};
</script>

<style scoped>
.header-wrapper {
  border-bottom: 1px solid #f0f0f0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 欢迎文字：加粗、清晰 */
.welcome-text {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

/* 退出按钮：加hover效果、不突兀 */
.logout-btn {
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.08);
}
</style>