<template>
  <div class="movie-list">
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>电影管理</a-breadcrumb-item>
      <a-breadcrumb-item>电影列表</a-breadcrumb-item>
    </a-breadcrumb>

    <div :style="{ padding: '24px', minHeight: '360px' }">
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
/**
 * 电影列表组件
 * 显示电影数据，支持搜索、分页、添加、编辑、删除操作
 */
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { getMovieList, deleteMovie, type Movie } from '../api/movieApi';
import SearchBar from './SearchBar.vue';

/**
 * 组件事件
 */
const emit = defineEmits(['addMovie', 'editMovie']);

/**
 * 搜索关键词
 */
const searchKeyword = ref('');

/**
 * 电影数据列表
 */
const movieData = ref<Movie[]>([]);

/**
 * 当前页码
 */
const currentPage = ref(1);

/**
 * 每页数量
 */
const pageSize = ref(10);

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 表格列配置
 */
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

/**
 * 分页配置
 */
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
});

/**
 * 加载电影数据
 * 1. 设置加载状态
 * 2. 从API获取电影列表数据
 * 3. 更新电影数据列表
 * 4. 处理加载失败情况
 * 5. 重置加载状态
 * 
 * @param keyword 搜索关键词（可选）
 * @param genre 电影类型（可选）
 */
const loadMovies = async (keyword?: string, genre?: string) => {
  // Step 1: 设置加载状态
  // 显示loading动画，提示用户数据正在加载
  loading.value = true;
  
  try {
    // Step 2: 调用API获取电影列表
    // 传入页码、每页数量、搜索关键词和类型
    const res = await getMovieList(
      currentPage.value,
      pageSize.value,
      searchKeyword.value || undefined
    );
    
    // Step 3: 更新电影数据列表
    // 从API响应中提取数据赋值给movieData
    movieData.value = res.data || [];
  } catch (error) {
    // Step 4: 处理加载失败情况
    // 显示错误提示信息
    message.error('加载失败');
  } finally {
    // Step 5: 重置加载状态
    // 无论成功或失败，都要关闭loading动画
    loading.value = false;
  }
};

/**
 * 处理搜索
 * 1. 更新搜索关键词
 * 2. 重置页码为第一页
 * 3. 重新加载电影数据
 * 
 * @param keyword 搜索关键词
 */
const handleSearch = (keyword: string) => {
  // Step 1: 更新搜索关键词
  searchKeyword.value = keyword;
  
  // Step 2: 重置页码为第一页
  // 搜索后从第一页开始显示
  currentPage.value = 1;
  
  // Step 3: 重新加载电影数据
  loadMovies();
};

/**
 * 处理表格分页变更
 * 1. 更新当前页码
 * 2. 更新每页数量
 * 3. 重新加载电影数据
 * 
 * @param pag 分页信息，包含current和pageSize
 */
const handleTableChange = (pag: any) => {
  // Step 1: 更新当前页码
  currentPage.value = pag.current;
  
  // Step 2: 更新每页数量
  pageSize.value = pag.pageSize;
  
  // Step 3: 重新加载电影数据
  loadMovies();
};

/**
 * 处理删除电影
 * @param record 电影记录
 */
const handleDelete = async (record: Movie) => {
  // Step 1: 检查电影ID是否存在
  // 如果ID不存在，不执行删除操作
  if (!record.id) return;
  
  try {
    // Step 2: 调用API删除电影
    await deleteMovie(record.id);
    
    // Step 3: 显示删除成功提示
    message.success('删除成功');
    
    // Step 4: 重新加载电影列表
    // 更新列表，移除已删除的电影
    loadMovies();
  } catch (error) {
    // Step 5: 处理删除失败情况
    message.error('删除失败，请检查网络连接');
  }
};

/**
 * 刷新电影列表
 * 暴露给父组件使用，用于手动刷新列表数据
 */
const refreshList = () => loadMovies();

/**
 * 暴露方法给父组件
 * 允许父组件通过ref调用refreshList方法
 */
defineExpose({ refreshList });

/**
 * 组件挂载时加载电影数据
 * 页面首次加载时自动获取电影列表
 */
onMounted(() => loadMovies());
</script>

<style scoped>
.movie-list { width: 100%; }
</style>