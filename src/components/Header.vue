<template>
  <a-layout-header 
    style="background: #fff; padding: 0; display: flex; justify-content: flex-end; align-items: center; padding-right: 24px;"
  >
    <div style="display: flex; align-items: center; gap: 16px;">
      <span v-if="currentUser">欢迎，{{ currentUser.username }}</span>
      <a-button type="text" v-if="currentUser" @click="handleLogout">
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
