<template>
  <a-spin :spinning="loading">
    <div v-if="userInfo" style="max-width: 600px;">
      <div style="border: 1px solid #e8e8e8; border-radius: 4px; padding: 24px;">
        <div style="margin-bottom: 16px;">
          <span style="font-weight: bold; display: inline-block; width: 80px;">用户名：</span>
          <span>{{ userInfo.username || '无' }}</span>
        </div>
        <div style="margin-bottom: 16px;">
          <span style="font-weight: bold; display: inline-block; width: 80px;">角色：</span>
          <span>{{ userInfo.role || '无' }}</span>
        </div>
        <div style="margin-bottom: 16px;">
          <span style="font-weight: bold; display: inline-block; width: 80px;">姓名：</span>
          <span>{{ userInfo.name || '无' }}</span>
        </div>
        <div style="margin-bottom: 16px;">
          <span style="font-weight: bold; display: inline-block; width: 80px;">电话：</span>
          <span>{{ userInfo.phone || '无' }}</span>
        </div>
        <div style="margin-bottom: 16px;">
          <span style="font-weight: bold; display: inline-block; width: 80px;">邮箱：</span>
          <span>{{ userInfo.email || '无' }}</span>
        </div>
      </div>
    </div>
    <div v-else style="padding: 60px 0; text-align: center;">
      <a-empty description="暂无个人信息" />
    </div>
  </a-spin>
</template>

<script setup lang="ts">
interface UserInfo {
  username: string;
  role: string;
  name: string;
  phone: string;
  email: string;
}

const props = defineProps<{
  userInfo: UserInfo | null;
  loading: boolean;
}>();
</script>