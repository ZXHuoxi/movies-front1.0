import { createApp } from 'vue'
import './style.css'        // 全局样式
import App from './App.vue'  // 根组件
import Antd from 'ant-design-vue'  // Ant Design Vue 组件库
import 'ant-design-vue/dist/reset.css'  // Ant Design 样式
import router from './router'  // 路由配置

// 创建Vue应用实例并挂载
createApp(App).use(router).use(Antd).mount('#app')
