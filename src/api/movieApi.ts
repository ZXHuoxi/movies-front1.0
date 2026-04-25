import axios from "axios";

/**
 * 电影接口类型定义
 */
export interface Movie {
  id?: number;
  movie_name: string;
  release_time: string;
  total_boxoffice: number;
  price: number;
  avg_show: number;
  genre: string;
  rating: number;
  country: string;
  duration: number;
  box_level: string;
  description: string;
}

/**
 * 国家统计接口类型定义
 */
export interface CountryStat {
  country: string;
  count: number;
}

/**
 * 缓存项接口
 */
interface CacheItem {
  data: any;              // 缓存数据
  timestamp: number;      // 缓存时间戳
}

// 缓存对象
const cache: Record<string, CacheItem> = {};
// 缓存持续时间（5分钟）
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * 获取电影列表
 * @param page 页码，默认1
 * @param size 每页数量，默认10
 * @param keyword 搜索关键词
 * @param genre 电影类型
 * @returns 电影列表数据
 */
async function getMovieList(page: number = 1, size: number = 10, keyword?: string, genre?: string) {
  const cacheKey = `getMovieList_${page}_${size}_${keyword || ''}_${genre || ''}`;

  const now = Date.now();
  // 检查缓存是否有效
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data;
  }

  const response = await axios.get("/api/movie/list", {
    params: { page, size, name: keyword, genre }
  });

  // 更新缓存
  cache[cacheKey] = {
    data: response.data,
    timestamp: now
  };

  return response.data;
}

/**
 * 清除电影列表缓存
 */
function clearCache() {
  Object.keys(cache).forEach(key => {
    if (key.startsWith('getMovieList_')) {
      delete cache[key];
    }
  });
}

/**
 * 添加电影
 * @param movie 电影信息
 * @returns 添加结果
 */
async function addMovie(movie: Movie) {
  const response = await axios.post("/api/movie/add", movie);
  clearCache();
  return response.data;
}

/**
 * 更新电影
 * @param movie 电影信息
 * @returns 更新结果
 */
async function updateMovie(movie: Movie) {
  const response = await axios.post("/api/movie/update", movie);
  clearCache();
  return response.data;
}

/**
 * 删除电影
 * @param id 电影ID
 * @returns 删除结果
 */
async function deleteMovie(id: number) {
  const response = await axios.post("/api/movie/delete", { id });
  clearCache();
  return response.data;
}

export { getMovieList, addMovie, updateMovie, deleteMovie };