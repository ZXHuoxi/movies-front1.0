import axios from "axios";

/**
 * 国家统计数据接口
 */
export interface CountryStat {
  country: string;
  count: number;
}

/**
 * 类型统计数据接口
 */
export interface GenreStat {
  name: string;
  value: number;
}

/**
 * 获取国家统计数据
 * @returns 国家统计数据数组
 */
async function getCountryStats() {
  const response = await axios.get("/api/analysis/country");
  return response.data;
}

/**
 * 获取类型统计数据
 * @returns 类型统计数据数组
 */
async function getGenreStats() {
  const response = await axios.get("/api/analysis/genre");
  return response.data;
}

export { getCountryStats, getGenreStats };