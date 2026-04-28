/**
 * 应用入口文件
 * 创建和挂载Vue应用实例
 */
import { createApp } from 'vue'  // 导入Vue的createApp函数
import './style.css'        // 导入全局样式
import App from './App.vue'  // 导入根组件
import Antd from 'ant-design-vue'  // 导入Ant Design Vue组件库
import 'ant-design-vue/dist/reset.css'  // 导入Ant Design样式
import router from './router'  // 导入路由配置

/**
 * 创建Vue应用实例
 * 1. 传入根组件App
 * 2. 使用路由插件
 * 3. 使用Ant Design Vue组件库
 * 4. 挂载到id为app的DOM元素
 */
createApp(App).use(router).use(Antd).mount('#app')
