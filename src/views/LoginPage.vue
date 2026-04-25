<template>
  <div class="login-container">
    <a-card :title="getCardTitle" style="width: 100%; text-align: center;">
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
// 标题文字
const getCardTitle = computed(() => {
  if (currentMode.value === 'forgetPassword') return '忘记密码';
  return currentMode.value === 'login' ? '登录' : '注册';
});

const handleSwitchMode = (mode: 'login' | 'register' | 'forgetPassword') => {
  currentMode.value = mode;
};

const handleLoginSuccess = () => {
  // 获取后端返回的真实角色
  const userInfo = localStorage.getItem('user');
  // 浏览器本地存储把刚才登录成功保存的用户信息拿出来
  const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
  
  if (parsedUserInfo?.role === 'admin') {
    router.push('/admin');
  } else {
    router.push('/user');
  }
};
// 注册成功,切登录
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
</style>