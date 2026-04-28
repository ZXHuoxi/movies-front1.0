<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { getCountryStats } from '../api/analysisApi';

const chartRef = ref<HTMLElement>();
let chart: echarts.ECharts | null = null;

// 缓存数据
const dataCache = ref<any[]>([]);
const cacheTimestamp = ref(0);
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

// 颜色列表
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA5AB', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
];

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  
  // 销毁已存在的图表实例
  if (chart) {
    chart.dispose();
  }
  
  // 创建新的图表实例
  chart = echarts.init(chartRef.value);
  
  // 设置图表配置
  const option = {
    backgroundColor: '#f8f9fc',
    title: {
      text: '🎬 各国电影产量分布',
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#2c3e50'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          const node = params.data;
          return `<strong>${node.name}</strong><br/>电影数量：${node.value} 部`;
        }
        return params.name;
      }
    },
    series: [{
      type: 'graph',
      layout: 'force', // 力导向布局，自动分散且美观
      force: {
        repulsion: 500, // 增大斥力，避免节点均匀分布
        edgeLength: 40, // 增大边长度，让节点之间的距离更大
        gravity: 0.05, // 减小重力，让节点更自由地分布
        friction: 0.1, // 减小摩擦，让节点的运动更灵活
        layoutAnimation: false, // 关闭布局动画，提高加载速度
        center: ['50%', '50%'], // 力导向布局的中心
        size: ['90%', '90%'] // 力导向布局的范围，设置为盒子的90%，确保节点在盒子范围内
      },
      roam: true, // 允许缩放/拖拽
      draggable: true,
      data: [],
      links: [],
      label: {
        show: true,
        position: 'bottom',
        offset: [0, 10],
        fontSize: 12,
        color: '#2c3e50'
      },
      itemStyle: {
        borderWidth: 0,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.1)'
      }
    }]
  };
  
  chart.setOption(option);
};

// 加载数据
const loadData = async () => {
  if (!chart) return;
  
  try {
    const now = Date.now();
    
    // 使用缓存数据
    if (dataCache.value.length > 0 && now - cacheTimestamp.value < CACHE_DURATION) {
      updateChart(dataCache.value);
      return;
    }
    
    // 从后端获取数据
    const res = await getCountryStats();
    const data = res.data || res || [];
    
    // 处理数据
    const nodes = data.map((item: any, index: number) => {
      const country = item.country || '未知';
      const count = item.count || item['COUNT(*)'] || 0;
      
      return {
        name: `${country} (${count})`,
        value: count,
        symbolSize: 10 + count * 0.4, // 根据数量调整节点大小
        itemStyle: {
          color: colors[index % colors.length]
        }
      };
    });
    
    // 更新缓存
    dataCache.value = nodes;
    cacheTimestamp.value = now;
    
    // 更新图表
    updateChart(nodes);
  } catch (error) {
    console.error('加载数据失败:', error);
  }
};

// 更新图表
const updateChart = (nodes: any[]) => {
  if (!chart) return;
  
  chart.setOption({
    series: [{
      data: nodes
    }]
  });
};

// 监听窗口大小变化
const handleResize = () => {
  chart?.resize();
};

onMounted(() => {
  initChart();
  // 先显示图表，再异步加载数据
  loadData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  chart?.dispose();
  chart = null;
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