<template>
  <a-layout style="min-height: 100vh">
    <Sidebar 
      v-model:collapsed="collapsed" 
      v-model:selectedKeys="selectedKeys"
      type="user"
    />

    <a-layout>
      <Header :current-user="currentUser" />

      <a-layout-content style="margin: 0 16px">
        <!-- 首页 -->
        <div v-if="selectedKeys[0] === '1'">
           <!-- 页面位置导航条 -->
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>首页</a-breadcrumb-item>
          </a-breadcrumb>

          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
            <!-- 轮播图 -->
            <Carousel :images="carouselImages" />

            <!-- 分类导航 -->
            <CategoryNav 
              :categories="categories" 
              :selected="selectedGenre"
              @category-click="handleGenreClick"
            />

            <!-- 搜索框 -->
            <SearchBar 
              v-model="searchKeyword" 
              @search="handleSearch" 
              @clear="handleClearSearch"
            />

            <!-- 电影卡片展示 -->
             <!-- 自带的加载动画 -->
            <a-spin :spinning="loading">
              <a-row :gutter="[24, 24]">
                <!-- 根据屏幕显示卡片 -->
                <a-col v-for="movie in movieData" :key="movie.id" :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                  <MovieCard :movie="movie" />
                </a-col>
              </a-row>
              
              <div v-if="!loading && movieData.length === 0" style="padding: 60px 0; text-align: center;">
                <a-empty description="暂无电影数据" />
              </div>
            </a-spin>
          </div>
        </div>

        <!-- 电影数据分析图表 -->
        <div v-else-if="selectedKeys[0] === '2'">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>电影分析</a-breadcrumb-item>
            <a-breadcrumb-item>数据图表</a-breadcrumb-item>
          </a-breadcrumb>

          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
            <h2 style="margin-bottom: 32px;">电影数据可视化图表</h2>
            
            <a-row :gutter="[24, 24]">
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <h3 style="margin-bottom: 24px;">电影-国家统计关系图</h3>
                <div style="height: 500px; border: 1px solid #e8e8e8; border-radius: 4px;">
                  <MovieGraph />
                </div>
              </a-col>
              
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <h3 style="margin-bottom: 24px;">电影-类型统计关系图</h3>
                <div style="height: 500px; border: 1px solid #e8e8e8; border-radius: 4px;">
                  <MoviePie/>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>

        <!-- 个人信息 -->
        <div v-else-if="selectedKeys[0] === '3'">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>个人中心</a-breadcrumb-item>
            <a-breadcrumb-item>个人信息</a-breadcrumb-item>
          </a-breadcrumb>

          <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
            <h2 style="margin-bottom: 24px;">个人信息</h2>
            
            <UserInfo 
              :user-info="userInfo" 
              :loading="userInfoLoading"
            />


          </div>
        </div>
      </a-layout-content>

      <Footer />
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup name="UserCenter">
import { ref, onMounted } from 'vue';
import { getCurrentUser } from '../api/loginApi';
import { getMovieList, type Movie } from '../api/movieApi';
import { getGenreStats } from '../api/analysisApi';
import { getUserInfo } from '../api/userApi';
import { message } from 'ant-design-vue';
import MovieGraph from '../components/MovieGraph.vue';
import MoviePie from '../components/MoviePie.vue';

// 导入新创建的组件
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import Carousel from '../components/Carousel.vue';
import CategoryNav from '../components/CategoryNav.vue';
import SearchBar from '../components/SearchBar.vue';
import MovieCard from '../components/MovieCard.vue';
import UserInfo from '../components/UserInfo.vue';
import Footer from '../components/Footer.vue';

const collapsed = ref(false);
const selectedKeys = ref(['1']);

// 当前登录用户
const currentUser = ref(getCurrentUser());

// 存放用户信息
const userInfo = ref<any>(null);
const userInfoLoading = ref(false);

// 加载当前登录用户的真实信息
const loadUserInfo = async () => {
  if (!currentUser.value || !currentUser.value.username) return;
  
  userInfoLoading.value = true;
  try {
    // 直接获取当前用户的信息
    const res = await getUserInfo(currentUser.value.username);
    
    if (res && (res.data || res)) {
      userInfo.value = res.data || res;
    } else {
      message.warning('未找到当前用户信息');
    }
  } catch (err) {
    message.error('获取个人信息失败');
  } finally {
    userInfoLoading.value = false;
  }
};



// 轮播图
const carouselImages = ref([
  '/image/1.webp','/image/2.jpg','/image/3.webp','/image/4.webp','/image/5.webp'
]);

// 分类
const categories = ref<any[]>([]);
const genreCache = ref<any[]>([]);//分类缓存
const genreCacheTimestamp = ref(0);//缓存的时间
const CACHE_DURATION = 5 * 60 * 1000;

// 电影
const movieData = ref<Movie[]>([]);
const movieCache = ref<any[]>([]);
const loading = ref(false);
const searchKeyword = ref('');
const selectedGenre = ref('');

const loadMovies = async (keyword?: string, genre?: string) => {
  loading.value = true;
  try {
    if (movieCache.value.length === 0) {
      const res = await getMovieList(1, 50);
      movieCache.value = res.data || [];
    }
    let movies = [...movieCache.value];
    if (genre) movies = movies.filter((m: any) => (m.genre || '').toLowerCase().includes(genre.toLowerCase()));
    if (keyword) movies = movies.filter((m: any) => (m.movie_name || '').toLowerCase().includes(keyword.toLowerCase()));
    movieData.value = movies;
  } catch (error) {
    message.error('加载电影失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = (keyword: string) => loadMovies(keyword, selectedGenre.value);
const handleClearSearch = () => { searchKeyword.value = ''; selectedGenre.value = ''; loadMovies(); };
const handleGenreClick = (g: string) => { selectedGenre.value = g; searchKeyword.value = ''; loadMovies('', g); };

const loadGenres = async () => {
  try {
    const now = Date.now();
    if (genreCache.value.length && now - genreCacheTimestamp.value < CACHE_DURATION) {
      categories.value = genreCache.value;
      return;
    }
    const res = await getGenreStats();
    const d = res.data || res || [];
    const list = d.map((it: any, i: number) => ({ key: `g${i}`, name: it.name || it.genre || '未知' }));
    categories.value = list;
    genreCache.value = list;
    genreCacheTimestamp.value = now;
  } catch (e) {}
};

onMounted(async () => {
  await Promise.all([loadGenres(), loadMovies(), loadUserInfo()]);
});
</script>

<style scoped>
/* 面包屑优化 */
.ant-breadcrumb {
  font-size: 14px;
  opacity: 0.7;
}

/* 内容容器优化：加柔和圆角+高级阴影+光泽感背景 */
.ant-layout-content > div > div {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
  position: relative;
  overflow: hidden;
}

/* 顶部添加微妙光泽线，增加高级感 */
.ant-layout-content > div > div::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #1890ff, transparent);
  opacity: 0.6;
}

/* 图表卡片标题 */
h2, h3 {
  font-weight: 600;
  color: #1a1a1a;
}

/* 电影卡片加载时的骨架感优化 */
.ant-spin-container {
  min-height: 200px;
}

/* 空状态优化 */
.ant-empty {
  opacity: 0.6;
}
</style>