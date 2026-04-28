<template>
  <a-form @submit.prevent="handleSubmit" layout="vertical">
    <FormItem label="用户名" :error="formErrors.username" required>
      <a-input v-model:value="form.username" placeholder="请输入用户名" />
    </FormItem>

    <FormItem label="新密码" :error="formErrors.password" required>
      <a-input-password v-model:value="form.password" placeholder="请输入新密码" />
    </FormItem>

    <FormItem label="确认密码" :error="formErrors.confirmPassword" required>
      <a-input-password v-model:value="form.confirmPassword" placeholder="请再次输入新密码" />
    </FormItem>

    <a-form-item v-if="errorMessage" :validate-status="'error'" :help="errorMessage">
      <div class="error-message">{{ errorMessage }}</div>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="isLoading" style="width: 100%">
        重置密码
      </a-button>
    </a-form-item>

    <a-form-item>
      <div class="toggle-mode">
        <a-button type="link" @click="$emit('switchMode', 'login')">
          返回登录
        </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts" name="ForgetPasswordForm">
/**
 * 忘记密码表单组件
 * 处理密码重置逻辑，包括表单验证和API调用
 */
import { reactive, ref } from 'vue';
import { forgetPassword } from '../api/forgetPasswordApi';
import FormItem from './FormItem.vue';
import type { FormData, FormErrors } from '../utils/validation';

/**
 * 组件事件
 * - switchMode: 切换到登录页面
 * - resetSuccess: 密码重置成功事件
 */
const emit = defineEmits(['switchMode', 'resetSuccess']);

/**
 * 表单数据
 * 包含用户名、新密码、确认密码等信息
 */
const form = reactive<FormData>({
  username: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  name: '',
  phone: '',
  email: ''
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
 * 处理表单提交
 * 1. 重置所有错误信息
 * 2. 依次验证表单字段：用户名、新密码、确认密码
 * 3. 验证通过后调用密码重置API
 * 4. 重置成功后触发resetSuccess事件
 */
const handleSubmit = async () => {
  // Step 1: 重置错误信息
  // 每次提交前清空之前的错误状态，避免错误信息残留
  errorMessage.value = '';
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof FormErrors] = '';
  });

  let isValid = true; // 标记验证是否通过

  // Step 2: 验证用户名
  // 用户名为必填项，不能为空
  if (!form.username) {
    formErrors.username = '用户名不能为空';
    isValid = false;
  }

  // Step 3: 验证新密码
  // 新密码为必填项，不能为空
  if (!form.password) {
    formErrors.password = '新密码不能为空';
    isValid = false;
  }

  // Step 4: 验证确认密码
  // 确认密码为必填项，且必须与新密码一致
  if (!form.confirmPassword) {
    // 如果确认密码为空，提示不能为空
    formErrors.confirmPassword = '确认密码不能为空';
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    // 如果确认密码与新密码不一致，提示用户
    formErrors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }

  // Step 5: 如果验证失败，直接返回，不继续提交
  if (!isValid) {
    return;
  }

  // Step 6: 设置加载状态
  // 防止用户重复点击提交按钮
  isLoading.value = true;
  
  try {
    // Step 7: 调用后端接口，真正重置密码
    // 传入用户名、新密码、确认密码
    await forgetPassword(form.username, form.password, form.confirmPassword);
    
    // Step 8: 密码重置成功，触发resetSuccess事件
    // 通知父组件密码重置成功
    emit('resetSuccess');
  } catch (error) {
    // Step 9: 密码重置失败，显示错误信息
    // 捕获API返回的错误信息并展示给用户
    errorMessage.value = '重置密码失败，请检查用户名是否正确';
  } finally {
    // Step 10: 重置加载状态
    // 无论成功或失败，都要重置loading状态
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