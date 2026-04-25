<template>
  <div class="carousel-wrapper">
    <a-carousel 
      autoplay 
      :autoplaySpeed="3000" 
      :arrows="false"
      dotPosition="bottom"
      class="full-carousel"
    >
      <!-- 轮播项 -->
      <div v-for="(image, index) in images" :key="index" class="carousel-slide">
        <img 
          :src="image" 
          :alt="`轮播图${index + 1}`" 
          class="carousel-image"
        />
      </div>
    </a-carousel>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  images?: string[];
}>();
</script>

<style scoped>
.carousel-wrapper {
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.full-carousel :deep(.slick-slide) {
  height: 480px;
  line-height: 0;
}

.full-carousel {
  position: relative;
}

.carousel-slide {
  width: 100%;
  height: 480px;
  display: flex !important;
  justify-content: center;
  align-items: center;
  background: #000;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.full-carousel :deep(.slick-dots) {
  bottom: 16px;
  z-index: 20;
}

.full-carousel :deep(.slick-dots li button) {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  height: 4px;
  width: 24px;
}

.full-carousel :deep(.slick-dots li.slick-active button) {
  background: #1890ff;
  width: 32px;
}
</style>