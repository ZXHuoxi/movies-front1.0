<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { getGenreStats } from '../api/analysisApi';
// 图表容器
const chartRef = ref<HTMLElement>();
let myChart: echarts.ECharts | null = null;

// 设置饼图每个区域的颜
const getGradientColors = () => {
  return [
    { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: '#FFB3BA' }, { offset: 1, color: '#FFDFE4' }] },
    { type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
      colorStops: [{ offset: 0, color: '#B5EAD7' }, { offset: 1, color: '#C7F0E2' }] },
    { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: '#FFDAC1' }, { offset: 1, color: '#FFE8D4' }] },
    { type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
      colorStops: [{ offset: 0, color: '#B5D0E7' }, { offset: 1, color: '#D1E4F5' }] },
    { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: '#E2F0CB' }, { offset: 1, color: '#F0F7E6' }] },
    { type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
      colorStops: [{ offset: 0, color: '#FFC8A2' }, { offset: 1, color: '#FFE0CD' }] },
    { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: '#C5E0B4' }, { offset: 1, color: '#E2F0D5' }] }
  ];
};

// 缓存数据，避免重复请求
let genreStatsCache: any[] = [];
let genreStatsTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 监听窗口大小变化
const handleResize = () => {
  myChart?.resize();
};

onMounted(() => {
  if (!chartRef.value) return;

  myChart = echarts.init(chartRef.value);

  // 先显示空图表
  myChart.setOption({
    backgroundColor: '#f8f9fc',
    title: {
      text: '🎬 电影类型分布',
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#2c3e50',
        textShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }
    },
    // 鼠标悬浮提示
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: { color: '#2c3e50', fontSize: 14 },
      formatter: (params: any) => {
        return `<strong>${params.name}</strong><br/>
                数量：${params.value}<br/>
                占比：${params.percent.toFixed(2)}%`;
      }
    },
    // toolbox
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false, title: '数据视图' },
        restore: { show: true, title: '还原' },
        saveAsImage: { show: true, title: '保存图片' }
      },
      right: 20,
      top: 20,
      iconStyle: { borderColor: '#aaa' }
    },
    series: [
      {
        name: '电影数量',
        type: 'pie',
        radius: ['35%', '70%'],
        center: ['55%', '55%'],
        roseType: 'area',
        avoidLabelOverlap: false,
        animation: false,
        itemStyle: {
          borderRadius: 12,
          borderWidth: 0,
          shadowBlur: 18,
          shadowColor: 'rgba(100, 100, 150, 0.35)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b} : {d}%',
          color: '#2c3e50',
          fontWeight: '500',
          textShadowBlur: 4,
          textShadowColor: 'rgba(255,255,255,0.8)'
        },
        labelLine: {
          length: 10,
          length2: 15,
          smooth: true,
          lineStyle: { color: '#aaa', width: 1.5 }
        },
        emphasis: {
          scale: true,
          scaleSize: 12,
          itemStyle: {
            shadowBlur: 28,
            shadowColor: 'rgba(180, 150, 80, 0.5)',
            borderWidth: 0,
          },
          label: { show: true, fontWeight: 'bold', fontSize: 16 }
        },
        data: []
      }
    ]
  });

  // 异步加载数据
  loadChartData();

  window.addEventListener('resize', handleResize);
});

// 加载图表数据
const loadChartData = async () => {
  if (!myChart) return;
  
  try {
    // 优化：使用缓存，避免重复请求
    let genreStatsData: any[] = [];
    const now = Date.now();
    
    if (genreStatsCache.length > 0 && now - genreStatsTimestamp < CACHE_DURATION) {
      // 使用缓存数据
      genreStatsData = genreStatsCache;
    } else {
      // 请求新数据
      const res = await getGenreStats();
      if (res && 'data' in res) {
        genreStatsData = Array.isArray(res.data) ? res.data : [];
      } else if (Array.isArray(res)) {
        genreStatsData = res;
      }
      // 更新缓存
      genreStatsCache = genreStatsData;
      genreStatsTimestamp = now;
    }

    if (genreStatsData.length === 0) {
      return;
    }

    const pieData = genreStatsData.map((stat: any, idx: number) => {
      const name = stat.name || stat.genre || '未知';
      const value = stat.value || stat.count || stat['COUNT(*)'] || 0;
      return {
        name: String(name),
        value: Number(value),
        itemStyle: { color: getGradientColors()[idx % getGradientColors().length] }
      };
    });

    myChart.setOption({
      series: [
        {
          data: pieData
        }
      ]
    });
  } catch (error) {
  }
};
// Vue 组件销毁时的清理工作
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  myChart?.dispose();
  myChart = null;
});
</script>

<style scoped>
/* 让容器有轻微阴影，提升质感 */
div[ref="chartRef"] {
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.02);
  background: #f8f9fc;
}
</style>