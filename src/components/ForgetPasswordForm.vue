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
import { reactive, ref } from 'vue';
import { forgetPassword } from '../api/forgetPasswordApi';
import FormItem from './FormItem.vue';
import type { FormData, FormErrors } from '../utils/validation';

const emit = defineEmits(['switchMode', 'resetSuccess']);

const form = reactive<FormData>({
  username: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  name: '',
  phone: '',
  email: ''
});

const formErrors = reactive<FormErrors>({});
const errorMessage = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  // 每次提交前先把错误清空
  errorMessage.value = '';
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof FormErrors] = '';
  });

  let isValid = true;

  if (!form.username) {
    formErrors.username = '用户名不能为空';
    isValid = false;
  }

  if (!form.password) {
    formErrors.password = '新密码不能为空';
    isValid = false;
  }

  if (!form.confirmPassword) {
    formErrors.confirmPassword = '确认密码不能为空';
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    formErrors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  isLoading.value = true;
// 调用后端接口，真正重置密码
  try {
    await forgetPassword(form.username, form.password, form.confirmPassword);
    emit('resetSuccess');
  } catch (error) {
    errorMessage.value = '重置密码失败，请检查用户名是否正确';
  } finally {
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