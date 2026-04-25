<template>
  <div class="movie-list">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>电影管理</a-breadcrumb-item>
      <a-breadcrumb-item>电影列表</a-breadcrumb-item>
    </a-breadcrumb>

    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; height: 40px;">
        <SearchBar
          v-model="searchKeyword"
          @search="handleSearch"
        />
        <a-button type="primary" style="height: 40px;" @click="$emit('addMovie')">
          添加电影
        </a-button>
      </div>

      <a-table
        :columns="movieColumns"
        :data-source="movieData"
        row-key="id"
        :pagination="pagination"
        :loading="loading"
        :local-pagination="false"
        @change="handleTableChange"
      >
        <template #actions="{ record }">
          <a-button type="primary" size="default" style="margin-right: 8px" @click="$emit('editMovie', record)">
            编辑
          </a-button>
          <a-button danger size="default" @click="handleDelete(record)">
            删除
          </a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts" name="MovieList">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { getMovieList, deleteMovie, type Movie } from '../api/movieApi';
import SearchBar from './SearchBar.vue';

const emit = defineEmits(['addMovie', 'editMovie']);
const searchKeyword = ref('');
const movieData = ref<Movie[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false);

const movieColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '电影名称', dataIndex: 'movie_name', key: 'movie_name', width: 150 },
  { title: '上映时间', dataIndex: 'release_time', key: 'release_time', width: 120 },
  { title: '总票房', dataIndex: 'total_boxoffice', key: 'total_boxoffice', width: 100 },
  { title: '票价', dataIndex: 'price', key: 'price', width: 80 },
  { title: '平均场次', dataIndex: 'avg_show', key: 'avg_show', width: 100 },
  { title: '类型', dataIndex: 'genre', key: 'genre', width: 100 },
  { title: '评分', dataIndex: 'rating', key: 'rating', width: 80 },
  { title: '国家', dataIndex: 'country', key: 'country', width: 100 },
  { title: '时长(分钟)', dataIndex: 'duration', key: 'duration', width: 100 },
  { title: '票房等级', dataIndex: 'box_level', key: 'box_level', width: 100 },
  { title: '操作', key: 'actions', width: 180, fixed: 'right' as const, slots: { customRender: 'actions' } }
];

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
});



const loadMovies = async () => {
  loading.value = true;
  try {
    const res = await getMovieList(
      currentPage.value,
      pageSize.value,
      searchKeyword.value || undefined
    );
    movieData.value = res.data || [];
  } catch (error) {
    message.error('加载失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword;
  currentPage.value = 1;
  loadMovies();
};
//切换页码
const handleTableChange = (pag: any) => {
  currentPage.value = pag.current;
  pageSize.value = pag.pageSize;
  loadMovies();
};

const handleDelete = async (record: Movie) => {
  if (!record.id) return;
  try {
    await deleteMovie(record.id);
    message.success('删除成功');
    loadMovies();
  } catch (error) {
    message.error('删除失败，请检查网络连接');
  }
};
// 调用加载电影
const refreshList = () => loadMovies();
// refreshList 暴露给父组件
defineExpose({ refreshList });
onMounted(() => loadMovies());
</script>

<style scoped>
.movie-list { width: 100%; }
</style>