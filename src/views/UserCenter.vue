<template>
  <a-layout style="min-height: 100vh; background-color: #ffffff;">
    <Sidebar v-model:collapsed="collapsed" v-model:selectedKeys="selectedKeys" type="user" />
    <a-layout style="background-color: #ffffff;">
      <Header :current-user="currentUser" />

      <a-layout-content style="margin: 0 16px">
        <!-- 首页 -->
        <div v-if="selectedKeys[0] === '1'">
           <!-- 页面位置导航条 -->
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>首页</a-breadcrumb-item>
          </a-breadcrumb>

          <div :style="{ padding: '24px', minHeight: '360px' }">
            <!-- 轮播图 -->
            <Carousel :images="carouselImages" />

            <!-- 分类导航 -->
            <CategoryNav 
              :categories="categories" 
              :selected="selectedGenre"
              @category-click="handleGenreClick"
            />

            <!-- 搜索框 -->
            <div class="search-container">
              <SearchBar 
                v-model="searchKeyword" 
                @search="handleSearch" 
                @clear="handleClearSearch"
              />
            </div>

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

          <div :style="{ padding: '24px', minHeight: '360px' }">
            <h2 style="margin-bottom: 32px;">电影数据可视化图表</h2>
            
            <a-row :gutter="[24, 24]">
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <!-- <h3 style="margin-bottom: 24px;">电影-国家统计关系图</h3> -->
                <div style="height: 500px; border: 1px solid #e8e8e8; border-radius: 20px; background: #ffffff; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);">
                  <MovieGraph />
                </div>
              </a-col>
              
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <!-- <h3 style="margin-bottom: 24px;">电影-类型统计关系图</h3> -->
                <div style="height: 500px; border: 1px solid #e8e8e8; border-radius: 20px; background: #ffffff; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);">
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

          <div :style="{ padding: '24px', minHeight: '360px' }">
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
/**
 * 用户中心页面
 * 包含首页、电影分析图表和个人信息三个子页面
 * 根据侧边栏选中的菜单项显示不同的内容
 */
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

/**
 * 侧边栏折叠状态
 * true-折叠，false-展开
 */
const collapsed = ref(false);

/**
 * 选中的菜单项
 * 1-首页，2-电影分析图表，3-个人信息
 */
const selectedKeys = ref(['1']);

/**
 * 当前登录用户
 * 从localStorage中获取
 */
const currentUser = ref(getCurrentUser());

/**
 * 用户信息
 */
const userInfo = ref<any>(null);

/**
 * 用户信息加载状态
 */
const userInfoLoading = ref(false);

/**
 * 加载当前登录用户的真实信息
 */
const loadUserInfo = async () => {
  //  检查当前用户是否登录
  if (!currentUser.value || !currentUser.value.username) return;
  
  // 设置加载状态
  userInfoLoading.value = true;
  
  try {
    //调用API获取用户信息
    const res = await getUserInfo(currentUser.value.username);
    
    //更新用户信息
    if (res && (res.data || res)) {
      userInfo.value = res.data || res;
    } else {
      // 如果未找到用户信息，显示警告
      message.warning('未找到当前用户信息');
    }
  } catch (err) {
    //处理加载失败情况
    message.error('获取个人信息失败');
  } finally {
    //重置加载状态
    userInfoLoading.value = false;
  }
};

/**
 * 轮播图图片
 * 包含多张电影相关图片
 */
const carouselImages = ref([
  '/image/1.webp','/image/2.jpg','/image/3.webp','/image/4.webp','/image/5.webp'
]);

/**
 * 电影分类列表
 */
const categories = ref<any[]>([]);

/*
 分类缓存
 */
const genreCache = ref<any[]>([]);

/**
 * 缓存的时间戳
 */
const genreCacheTimestamp = ref(0);

/**
 * 缓存持续时间（5分钟）
 * 缓存超过5分钟需要重新获取
 */
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * 电影数据列表
 */
const movieData = ref<Movie[]>([]);

/**
 * 电影缓存
 * 避免重复请求API
 */
const movieCache = ref<any[]>([]);

/**
 * 电影加载状态
 */
const loading = ref(false);

/**
 * 搜索关键词
 */
const searchKeyword = ref('');

/**
 * 选中的电影类型
 */
const selectedGenre = ref('');

/**
 * 加载电影数据
 * @param keyword 搜索关键词（可选）
 * @param genre 电影类型（可选）
 */
const loadMovies = async (keyword?: string, genre?: string) => {
  // Step 1: 设置加载状态
  loading.value = true;
  
  try {
    // 如果电影缓存为空，说明首次加载，需要从API获取
    if (movieCache.value.length === 0) {
      const res = await getMovieList(1, 50);
      movieCache.value = res.data || [];
    }
    
    // 从缓存中复制电影数据
    let movies = [...movieCache.value];
    
    // 如果指定了类型，则只保留该类型的电影
    if (genre) {
      movies = movies.filter((m: any) => 
        (m.genre || '').toLowerCase().includes(genre.toLowerCase())
      );
    }
    
    // 如果指定了关键词，则只保留电影名包含该关键词的电影
    if (keyword) {
      movies = movies.filter((m: any) => 
        (m.movie_name || '').toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    // 更新电影数据列表
    movieData.value = movies;
  } catch (error) {
    // 处理加载失败情况
    message.error('加载电影失败');
  } finally {
    // 重置加载状态
    loading.value = false;
  }
};

/**
 * 处理搜索
 * 1. 更新搜索关键词
 * 2. 重置页码为第一页（如果是分页列表）
 * 3. 重新加载电影数据
 * 
 * @param keyword 搜索关键词
 */
const handleSearch = (keyword: string) => {
  // Step 1: 更新搜索关键词
  searchKeyword.value = keyword;
  
  // Step 2 & 3: 重置页码并重新加载电影数据
  loadMovies(keyword, selectedGenre.value);
};

/**
 * 清除搜索
 * 1. 清空搜索关键词
 * 2. 清空选中的类型
 * 3. 重新加载所有电影
 */
const handleClearSearch = () => { 
  // 清空搜索关键词
  searchKeyword.value = ''; 
  
  // 清空选中的类型
  selectedGenre.value = ''; 
  
  // 重新加载所有电影
  loadMovies(); 
};

/**
 * 处理分类点击
 * 1. 更新选中的类型
 * 2. 清空搜索关键词（避免同时搜索和按类型筛选）
 * 3. 重新加载电影数据
 * 
 * @param g 分类名称
 */
const handleGenreClick = (g: string) => { 
  // Step 1: 更新选中的类型
  selectedGenre.value = g; 
  
  // Step 2: 清空搜索关键词
  searchKeyword.value = ''; 
  
  // Step 3: 重新加载电影数据
  loadMovies('', g); 
};

/**
 * 加载电影分类
 * 1. 检查缓存是否有效（未过期）
 * 2. 如果缓存有效，直接使用缓存数据
 * 3. 如果缓存无效或不存在，调用API获取分类数据
 * 4. 更新分类列表和缓存
 */
const loadGenres = async () => {
  try {
    // Step 1: 获取当前时间
    const now = Date.now();
    
    // Step 2: 检查缓存是否有效
    // 如果缓存存在且未过期（距离上次获取不到5分钟），直接使用缓存
    if (genreCache.value.length && now - genreCacheTimestamp.value < CACHE_DURATION) {
      categories.value = genreCache.value;
      return;
    }
    
    // Step 3: 缓存无效，调用API获取分类数据
    const res = await getGenreStats();
    
    // Step 4: 处理API返回的数据
    // 提取数据，并转换为组件需要的格式
    const d = res.data || res || [];
    const list = d.map((it: any, i: number) => ({ 
      key: `g${i}`, 
      name: it.name || it.genre || '未知' 
    }));
    
    // Step 5: 更新分类列表和缓存
    categories.value = list;
    genreCache.value = list;
    genreCacheTimestamp.value = now;
  } catch (e) {
    // 忽略错误，不影响页面显示
  }
};

/**
 * 组件挂载时加载数据
 * 并行加载：分类数据、电影数据、用户信息
 * 提升页面加载速度
 */
onMounted(async () => {
  // 使用Promise.all并行加载多个数据
  await Promise.all([loadGenres(), loadMovies(), loadUserInfo()]);
});
</script>

<style scoped>
/* 面包屑优化：把文字调明显 */
.ant-breadcrumb {
  font-size: 16px !important;
  opacity: 1 !important;
  font-weight: 500 !important;
  margin-bottom: 20px !important;
}
.ant-breadcrumb :deep(.ant-breadcrumb-item) {
  color: #333 !important;
  transition: all 0.3s ease !important;
}
.ant-breadcrumb :deep(.ant-breadcrumb-item:hover) {
  transform: translateY(-2px) !important;
}
.ant-breadcrumb :deep(.ant-breadcrumb-separator) {
  color: #999 !important;
}

/* 内容容器优化*/
.ant-layout-content > div > div {
  /* border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  background: #ffffff; */
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
}

.ant-layout-content > div > div:hover {
  transform: translateY(-8px);
  /* box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15); */
  
}

/* 顶部添加微妙光泽线*/
.ant-layout-content > div > div::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #a8edea, #fed6e3, transparent);
  opacity: 0.6;
}

/* 图表卡片标题 */
h2, h3 {
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  letter-spacing: 1px !important;
  transition: all 0.3s ease;
}

h2:hover, h3:hover {
  transform: translateY(-2px);
}

/* 电影卡片加载状态*/
.ant-spin-container {
  min-height: 200px;
}
.search-container {
  margin: -10px 0 20px 0;
  position: relative;
  top: -10px;
}

.SearchBar{
  margin-bottom: 20px;
}
/* 空状态优化 */
.ant-empty {
  opacity: 0.6;
}
</style>