<template>
  <a-card 
    hoverable 
    class="movie-card"
    style="height: 100%;"
  >
    <template #cover>
      <div style="height: 200px; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.3);"></div>
        <span style="color: white; font-size: 24px; font-weight: bold; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); position: relative; z-index: 1;">
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