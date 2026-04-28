<template>
  <!-- 登录表单组件 -->
  <a-form @submit.prevent="handleSubmit" layout="vertical">
    <!-- 用户名输入 -->
    <FormItem label="用户名" :error="formErrors.username">
      <a-input v-model:value="form.username" placeholder="请输入用户名" />
    </FormItem>

    <!-- 密码输入 -->
    <FormItem label="密码" :error="formErrors.password">
      <a-input-password v-model:value="form.password" placeholder="请输入密码" />
    </FormItem>

    <!-- 角色选择 -->
    <FormItem label="角色" >
      <a-radio-group v-model:value="form.role" style="width: 100%; display: flex; gap: 20px;">
        <a-radio value="user">用户</a-radio>
        <a-radio value="admin">管理员</a-radio>
      </a-radio-group>
    </FormItem>

    <!-- 错误信息显示 -->
    <a-form-item v-if="errorMessage" :validate-status="'error'" :help="errorMessage">
    </a-form-item>

    <!-- 登录按钮 -->
    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="isLoading" style="width: 100%">
        登录
      </a-button>
    </a-form-item>

    <!-- 切换到注册 -->
    <a-form-item>
      <div class="toggle-mode">
        <span>还没有账号？</span>
        <a-button type="link" @click="$emit('switchMode', 'register')">
          注册
        </a-button>
      </div>
    </a-form-item>

    <!-- 切换到忘记密码 -->
    <a-form-item>
      <div class="toggle-mode">
        <a-button type="link" @click="$emit('switchMode', 'forgetPassword')">
          忘记密码？
        </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts" name="LoginForm">
/**
 * 登录表单组件
 * 处理用户登录逻辑，包括表单验证和API调用
 * 支持用户和管理员两种角色登录
 */
import { reactive, ref } from 'vue';
import { login } from '../api/loginApi';
import FormItem from './FormItem.vue';
import type { FormData, FormErrors } from '../utils/validation';

/**
 * 组件事件
 * - switchMode: 切换到其他表单（注册/忘记密码）
 * - loginSuccess: 登录成功事件
 */
const emit = defineEmits(['switchMode', 'loginSuccess']);

/**
 * 表单数据
 * 包含用户名、密码、确认密码、角色、姓名、电话、邮箱等信息
 */
const form = reactive<FormData>({
  username: '', // 用户名
  password: '', // 密码
  confirmPassword: '', // 确认密码
  role: 'user', // 角色，默认为用户
  name: '', // 姓名
  phone: '', // 手机号
  email: '' // 邮箱
});

/**
 * 表单错误信息
 * 用于存储各个字段的验证错误信息
 */
const formErrors = reactive<FormErrors>({});

/**
 * 全局错误信息
 * 用于显示API调用失败等全局性错误
 */
const errorMessage = ref('');

/**
 * 加载状态
 * 防止重复提交，控制按钮的loading状态
 */
const isLoading = ref(false);

/**
 处理表单提交
 */
const handleSubmit = async () => {
  //  重置错误信息
  errorMessage.value = '';
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof FormErrors] = '';
  });

  //验证用户名
  if (!form.username) {
    formErrors.username = '用户名不能为空';
    return;
  }

  //  验证密码
  if (!form.password) {
    formErrors.password = '密码不能为空';
    return;
  }
  
  // 验证角色
  if (!form.role) {
    formErrors.role = '请选择角色';
    return;
  }

  // 设置加载状态
  isLoading.value = true;

  try {
    //  调用登录API
    await login(form.username, form.password, form.role);
    
    //  登录成功，触发loginSuccess事件
    emit('loginSuccess');
  } catch (error: any) {
    //  登录失败，显示错误信息
    errorMessage.value = error.message || '登录失败，请检查用户名和密码';
  } finally {
    //重置加载状态
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 420px;
  margin: 0 auto;
  margin-top: 5rem;
}

/* 给登录卡片和背景区分开 */
:deep(.login-card.ant-card) {
  background-color: #ffffff !important; /* 纯白卡片，和 #fdfdf9 区分 */
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  /* 禁用抖动 */
  transition: none !important;
  transform: none !important;
  animation: none !important;
}
:deep(.login-card.ant-card:hover) {
  transform: none !important;
  animation: none !important;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
}

:deep(.login-card .ant-card-head) {
  background-color: #ffffff !important;
  border-bottom: 1px solid #f5f5f5;
}
:deep(.login-card .ant-card-body) {
  background-color: #ffffff !important;
}
</style>