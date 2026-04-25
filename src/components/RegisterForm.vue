<template>
  <!-- 注册表单组件 -->
  <a-form @submit.prevent="handleSubmit" layout="vertical">
    <!-- 用户名输入 -->
    <FormItem label="用户名" :error="formErrors.username" required>
      <a-input v-model:value="form.username" placeholder="请输入用户名" />
    </FormItem>
    
    <!-- 密码输入 -->
    <FormItem label="密码" :error="formErrors.password" required>
      <a-input-password v-model:value="form.password" placeholder="请输入密码" />
    </FormItem>
    
    <!-- 确认密码输入 -->
    <FormItem label="确认密码" :error="formErrors.confirmPassword" required>
      <a-input-password v-model:value="form.confirmPassword" placeholder="请再次输入密码" />
    </FormItem>
    
    <!-- 姓名输入 -->
    <FormItem label="姓名" :error="formErrors.name" required>
      <a-input v-model:value="form.name" placeholder="请输入姓名" />
    </FormItem>
    
    <!-- 电话输入 -->
    <FormItem label="电话" :error="formErrors.phone" required>
      <a-input v-model:value="form.phone" placeholder="请输入电话" />
    </FormItem>
    
    <!-- 邮箱输入 -->
    <FormItem label="邮箱" :error="formErrors.email" >
      <a-input v-model:value="form.email" placeholder="请输入邮箱" />
    </FormItem>
    
    <!-- 错误信息显示 -->
    <div v-if="errorMessage" style="color: red; margin-bottom: 16px;">{{ errorMessage }}</div>
    
    <!-- 注册按钮 -->
    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="isLoading" style="width: 100%">
        注册
      </a-button>
    </a-form-item>
    
    <!-- 切换到登录 -->
    <a-form-item>
      <div class="toggle-mode">
        <span>已有账号？</span>
        <a-button type="link" @click="$emit('switchMode', 'login')">
          登录
        </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts" name="RegisterForm">
import { reactive, ref } from 'vue';
import { register } from '../api/registerApi';
import FormItem from './FormItem.vue';
import { message } from 'ant-design-vue';
import type { FormData, FormErrors } from '../utils/validation';

// 定义事件切换页面
const emit = defineEmits(['switchMode']);

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
  
  let isValid = true;
  
  // 验证用户名
  if (!form.username) {
    formErrors.username = '用户名不能为空';
    isValid = false;
  }
  
  // 验证密码
  if (!form.password) {
    formErrors.password = '密码不能为空';
    isValid = false;
  }
  
  // 验证确认密码
  if (!form.confirmPassword) {
    formErrors.confirmPassword = '确认密码不能为空';
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    formErrors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }
  
  // 验证姓名
  if (!form.name) {
    formErrors.name = '姓名不能为空';
    isValid = false;
  }
  
  // 验证电话
  if (!form.phone) {
    formErrors.phone = '电话不能为空';
    isValid = false;
  }
  
  // 验证邮箱
  if (!form.email) {
    formErrors.email = '邮箱不能为空';
    isValid = false;
  }
  
  // 如果验证失败，返回
  if (!isValid) {
    return;
  }
  
  // 设置加载状态
  isLoading.value = true;
  
  try {
    // 调用注册API
    await register(form.username, form.password, form.confirmPassword, form.name, form.phone, form.email);
    // 显示成功提示
    message.success('注册成功');
    // 3秒后跳转到登录页面
    setTimeout(() => {
      emit('switchMode', 'login');
    }, 3000);
  } catch (error: any) {
    // 显示错误信息
    errorMessage.value = error.message || '注册失败，请检查输入信息';
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