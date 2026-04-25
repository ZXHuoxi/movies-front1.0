<template>
  <a-card 
    hoverable 
    style="height: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); transition: all 0.3s ease;"
  >
    <template #cover>
      <div style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; overflow: hidden;">
        <span style="color: white; font-size: 24px; font-weight: bold; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
          {{ movie.movie_name }}
        </span>
      </div>
    </template>
    <a-card-meta :title="movie.movie_name" />
    <div style="margin-top: 12px; padding: 0 16px 16px;">
      <p style="margin: 8px 0; font-size: 14px;"><strong>上映时间：</strong>{{ movie.release_time }}</p>
      <p style="margin: 8px 0; font-size: 14px;"><strong>类型：</strong>{{ movie.genre }}</p>
      <p style="margin: 8px 0; font-size: 14px;"><strong>评分：</strong>
        <!-- <a-tag>：Ant Design 的小标签组件 -->
        <a-tag :color="movie.rating >= 8 ? 'green' : movie.rating >= 6 ? 'orange' : 'red'" style="margin-left: 4px;">
          {{ movie.rating }}
        </a-tag>
      </p>
      <p style="margin: 8px 0; font-size: 14px;"><strong>票房：</strong>{{ movie.total_boxoffice }}</p>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import type { Movie } from '../api/movieApi';

const props = defineProps<{
  movie: Movie;
}>();
</script>