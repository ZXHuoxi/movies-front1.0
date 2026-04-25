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
      <a-select v-model:value="form.role" style="width: 100%">
        <a-select-option value="user">用户</a-select-option>
        <a-select-option value="admin">管理员</a-select-option>
      </a-select>
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
import { reactive, ref } from 'vue';
import { login } from '../api/loginApi';
import FormItem from './FormItem.vue';
import type { FormData, FormErrors } from '../utils/validation';

// 定义事件
const emit = defineEmits(['switchMode', 'loginSuccess']);

// 表单数据
const form = reactive<FormData>({
  username: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  name: '',
  phone: '',
  email: ''
});

// 表单错误信息
const formErrors = reactive<FormErrors>({});
// 全局错误信息
const errorMessage = ref('');
// 加载状态
const isLoading = ref(false);

/**
 * 处理表单提交
 */
const handleSubmit = async () => {
  // 重置错误信息
  errorMessage.value = '';
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof FormErrors] = '';
  });

  // 验证用户名
  if (!form.username) {
    formErrors.username = '用户名不能为空';
    return;
  }

  // 验证密码
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
    // 调用登录API
    await login(form.username, form.password, form.role);
    // 触发登录成功事件
    emit('loginSuccess');
  } catch (error: any) {
    // 显示错误信息
    errorMessage.value = error.message || '登录失败，请检查用户名和密码';
  } finally {
    // 重置加载状态
    isLoading.value = false;
  }
};
</script>

<style scoped>
.toggle-mode {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-top: 1rem;
}
</style>