<template>
  <a-layout style="min-height: 100vh; background-color: #ffffff;">
    <Sidebar
      v-model:collapsed="collapsed" 
      v-model:selectedKeys="selectedKeys"
      type="admin"
    />

    <a-layout style="background-color: #ffffff;">
      <Header :current-user="currentUser" />
      <a-layout-content style="margin: 0 16px">

        <!-- ====================== 用户管理 ====================== -->
        <div v-if="selectedKeys[0] === '1'">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>用户管理</a-breadcrumb-item>
          </a-breadcrumb>

          <div :style="{ padding: '24px', minHeight: '360px' }">
            <div style="margin-bottom: 16px">
              <a-button type="primary" @click="showAddUserModal = true">
                添加用户
              </a-button>
            </div>

            <a-table :columns="userColumns" :data-source="userData" row-key="id">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'actions'">
                  <a-button type="primary" size="default" style="margin-right: 8px" @click="handleEditUser(record)">编辑</a-button>
                  <a-button danger size="default" @click="handleDeleteUser(record)">删除</a-button>
                </template>
              </template>
            </a-table>

            <a-modal
              v-model:open="showAddUserModal"
              title="添加用户"
              width="600px"
              :footer="null"
            >
            <!-- 关闭弹窗后刷新 -->
              <AddUser @close="showAddUserModal = false; loadUsers()" />
            </a-modal>

            <!-- 编辑用户模态框 -->
            <a-modal
              v-model:open="showEditUserModal"
              title="编辑用户"
              width="600px"
              :footer="null"
            >
              <div class="edit-user">
                <a-form @submit.prevent="handleUpdateUser" layout="vertical">
                  <a-form-item label="用户名" required>
                    <a-input v-model:value="editUser.username" placeholder="请输入用户名" />
                  </a-form-item>
                  <a-form-item label="密码" required>
                    <a-input-password v-model:value="editUser.password" placeholder="请输入密码" />
                  </a-form-item>
                  <a-form-item label="姓名" >
                    <a-input v-model:value="editUser.name" placeholder="请输入姓名" />
                  </a-form-item>
                  <a-form-item label="电话" >
                    <a-input v-model:value="editUser.phone" placeholder="请输入电话" />
                  </a-form-item>
                  <a-form-item label="邮箱">
                    <a-input v-model:value="editUser.email" placeholder="请输入邮箱" />
                  </a-form-item>
                  <a-form-item label="角色" required>
                    <a-radio-group v-model:value="editUser.role">
                      <a-radio value="user">普通用户</a-radio>
                      <a-radio value="admin">管理员</a-radio>
                    </a-radio-group>
                  </a-form-item>
                  <a-form-item>
                    <div style="display: flex; justify-content: flex-end; gap: 12px; align-items: center;">
                      <a-button size="default" style="width: 100px;" @click="showEditUserModal = false">取消</a-button>
                      <a-button size="default" type="primary" style="width: 100px;" html-type="submit">保存</a-button>
                    </div>
                  </a-form-item>
                </a-form>
              </div>
            </a-modal>
          </div>
        </div>
        <!-- ====================== 电影数据管理 ====================== -->
        <div v-else-if="selectedKeys[0] === '2'">
          <MovieList
            ref="movieListRef"
            @addMovie="handleAddMovie"
            @editMovie="handleEditMovie"
          />

          <a-modal
              v-model:open="showMovieModal"
              :title="isEditMovie ? '编辑电影' : '添加电影'"
              width="800px"
              :footer="null"
            >
              <MovieForm
                :movie="currentMovie"
                @close="showMovieModal = false"
                @success="handleMovieSuccess"
              />
            </a-modal>
        </div>

      </a-layout-content>

      <Footer />
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup name="AdminCenter">
import { ref, onMounted } from 'vue';
import AddUser from '../components/AddUser.vue';
import MovieList from '../components/MovieList.vue';
import MovieForm from '../components/MovieForm.vue';
import { getUsers, deleteUser, updateUser } from '../api/userApi';
import { getCurrentUser } from '../api/loginApi';
import { message } from 'ant-design-vue';
import type { Movie } from '../api/movieApi';

// 导入创建的组件
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const collapsed = ref(false);
 // 当前选中菜单（默认1=用户管理）
const selectedKeys = ref<string[]>(['1']);
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);

// 编辑用户表单数据
const editUser = ref({
  id: 0,
  username: '',
  password: '',
  name: '',
  phone: '',
  email: '',
  role: 'user',
});

// const router = useRouter();

// 当前用户信息
const currentUser = ref(getCurrentUser());

// 监听localStorage变化
window.addEventListener('storage', () => {
  currentUser.value = getCurrentUser();
});

// 用户表格列
const userColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '电话', dataIndex: 'phone', key: 'phone' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '角色', dataIndex: 'role', key: 'role' },
  { title: '操作', key: 'actions' },
];

// 后端返回的用户数据放这里，页面自动渲染。
const userData = ref([]);

// 加载用户
const loadUsers = async () => {
  try {
    // 请求后端
    const res = await getUsers();
    console.log('加载用户响应:', res);
     // 数据赋值给表格
    userData.value = res.data || [];
    console.log('用户数据:', userData.value);
  } catch (err) {
    message.error('加载用户失败');
  }
};

// 电影相关
// 刷新列表
const movieListRef = ref();
const showMovieModal = ref(false);
const isEditMovie = ref(false);
const currentMovie = ref<Movie | undefined>(undefined);

// 添加电影
const handleAddMovie = () => {
  isEditMovie.value = false;
  currentMovie.value = undefined;
  showMovieModal.value = true;
};

// 编辑电影
const handleEditMovie = (movie: Movie) => {
  isEditMovie.value = true;
  currentMovie.value = movie;
  showMovieModal.value = true;
};

const handleMovieSuccess = () => {
  showMovieModal.value = false;
  // 重新拉取电影列表并刷新界面
  movieListRef.value?.refreshList();
};

// 编辑用户
// record当前行
const handleEditUser = (record: any) => {
  if (!record || !record.id) {
    message.error('用户信息不完整，无法编辑');
    return;
  }

  editUser.value = {
    id: record.id,
    username: record.username || '',
    password: record.password || '',
    name: record.name || '',
    phone: record.phone || '',
    email: record.email || '',
    role: record.role || 'user',
  };
  // 打开编辑用户模态框
  showEditUserModal.value = true;
};

// 更新用户
const handleUpdateUser = async () => {
  try {
    if (!editUser.value.id) {
      message.error('用户ID不存在');
      return;
    }
    // 调用修改用户的API
    await updateUser(
      editUser.value.id,
      editUser.value.username,
      editUser.value.password,
      editUser.value.name,
      editUser.value.phone,
      editUser.value.email,
      editUser.value.role
    );
    message.success('修改用户成功');
    // 关闭模态框
    showEditUserModal.value = false;
    await loadUsers();
  } catch (error: any) {
    message.error(error.message || '修改用户失败');
  }
};

// 删除用户
const handleDeleteUser = async (record: any) => {
  try {
    if (!record.id) {
      message.error('用户ID不存在');
      return;
    }
    // 调用删除用户的API
    await deleteUser(record.id);
    message.success('删除用户成功');
    await loadUsers();
  } catch (error: any) {
    message.error(error.message || '删除用户失败');
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>

</style>