<template>
  <div class="add-user">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      <a-breadcrumb-item>添加用户</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', minHeight: '360px' }">
      <a-form @submit.prevent="handleAddUser" layout="vertical">
        <a-form-item label="用户名" required>
          <a-input v-model:value="newUser.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="密码" required>
          <a-input-password v-model:value="newUser.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="姓名" >
          <a-input v-model:value="newUser.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="电话" >
          <a-input v-model:value="newUser.phone" placeholder="请输入电话" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="newUser.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="角色" required>
  <a-radio-group v-model:value="newUser.role">
    <a-radio value="user">普通用户</a-radio>
    <a-radio value="admin">管理员</a-radio>
  </a-radio-group>
</a-form-item>
        <a-form-item>
          <div style="display: flex; justify-content: flex-end; gap: 12px; align-items: center;">
            <a-button size="default" style="width: 100px;" @click="emit('close')">取消</a-button>
            <a-button size="default" type="primary" style="width: 100px;" html-type="submit">添加用户</a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup name="AddUser">
import { reactive } from 'vue';
import { addUser } from '../api/userApi';
import { message } from 'ant-design-vue';

// 定义事件
// 发送关闭信息
const emit = defineEmits(['close']);

// 新增用户表单数据
const newUser = reactive({
  username: '',
  password: '',
  name: '',
  phone: '',
  email: '',
  role: 'user',
});

// 处理添加用户
const handleAddUser = async () => {
  try {
    console.log('添加用户:', newUser);
    // 调用后端API
    await addUser(
      newUser.username,
      newUser.password,
      newUser.name,
      newUser.phone,
      newUser.email,
      newUser.role
    );
    // 显示成功消息
    message.success('添加用户成功');
    // 重置表单
    newUser.username = '';
    newUser.password = '';
    newUser.name = '';
    newUser.phone = '';
    newUser.email = '';
    newUser.role = 'user';
    // 关闭模态框
    emit('close');
  } catch (error: any) {
    message.error(error.message || '添加用户失败，请检查输入信息');
  }
};
</script>

<style scoped>
.add-user {
  width: 100%;
}
</style>