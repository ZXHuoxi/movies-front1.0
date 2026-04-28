<template>
  <div class="carousel-wrapper">
    <a-carousel
      ref="carouselRef"
      autoplay
      :autoplaySpeed="3000"
      :arrows="false"
      dotPosition="bottom"
      class="full-carousel"
    >
      <div v-for="(image, index) in images" :key="index" class="carousel-slide">
        <img :src="image" :alt="`轮播图${index + 1}`" class="carousel-image" />
      </div>
    </a-carousel>

    <!-- 左右箭头 -->
    <button class="arrow-btn left" @click="prev">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <button class="arrow-btn right" @click="next">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  images?: string[]
}>()

const carouselRef = ref<any>(null)

const prev = () => {
  carouselRef.value?.prev()
}
const next = () => {
  carouselRef.value?.next()
}
</script>

<style scoped>
.carousel-wrapper {
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.full-carousel :deep(.slick-slide) {
  height: 480px;
  line-height: 0;
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

/* ========== 左右箭头 ========== */
.arrow-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}
.arrow-btn.left { left: 20px; }
.arrow-btn.right { right: 20px; }
.arrow-btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-50%) scale(1.1);
}

/* ========== 指示器 ========== */
.full-carousel :deep(.slick-dots) {
  bottom: 18px;
}
.full-carousel :deep(.slick-dots li button) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  opacity: 1;
}
.full-carousel :deep(.slick-dots li.slick-active button) {
  background: #ffffff;
  width: 24px;
  border-radius: 6px;
}
</style>