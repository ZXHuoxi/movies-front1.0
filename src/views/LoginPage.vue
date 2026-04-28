<template>
  <div class="login-container">
    <a-card 
      :title="getCardTitle" 
      style="width: 100%; text-align: center;"
      class="login-card"
    >
      <LoginForm 
        v-if="currentMode === 'login'" 
        @switchMode="handleSwitchMode" 
        @loginSuccess="handleLoginSuccess" 
      />
      <RegisterForm 
        v-else-if="currentMode === 'register'" 
        @switchMode="handleSwitchMode" 
        @registerSuccess="handleRegisterSuccess" 
      />
      <ForgetPasswordForm 
        v-else-if="currentMode === 'forgetPassword'" 
        @switchMode="handleSwitchMode" 
        @resetSuccess="handleResetSuccess" 
      />
    </a-card>
  </div>
</template>

<script setup lang="ts" name="LoginPage">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';
import RegisterForm from '../components/RegisterForm.vue';
import ForgetPasswordForm from '../components/ForgetPasswordForm.vue';

const router = useRouter();

const currentMode = ref<'login' | 'register' | 'forgetPassword'>('login');

const getCardTitle = computed(() => {
  if (currentMode.value === 'forgetPassword') return '忘记密码';
  return currentMode.value === 'login' ? '登录' : '注册';
});

const handleSwitchMode = (mode: 'login' | 'register' | 'forgetPassword') => {
  currentMode.value = mode;
};

const handleLoginSuccess = () => {
  const userInfo = localStorage.getItem('user');
  const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
  
  if (parsedUserInfo?.role === 'admin') {
    router.push('/admin');
  } else {
    router.push('/user');
  }
};

const handleRegisterSuccess = () => {
  currentMode.value = 'login';
};

const handleResetSuccess = () => {
  currentMode.value = 'login';
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  margin-top: 5rem;
}

:deep(.login-card.ant-card) {
  background: #ffffff !important;
  border-radius: 22px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
  border: 1px solid #eee !important;
  
  /* 禁止抖动 */
  transition: none !important;
  transform: none !important;
  animation: none !important;
}

:deep(.login-card.ant-card:hover) {
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15) !important;
  transform: none !important;
}

:deep(.login-card .ant-card-head) {
  background: #ffffff !important;
  border-bottom: 1px solid #f5f5f5 !important;
}
:deep(.login-card .ant-card-body) {
  background: #ffffff !important;
}
</style>