<template>
  <div class="documentation">
    <!-- 顶部导航 -->
    <div class="navbar">
      <div class="left">
        <span class="logo">🎬 Movie Hub</span>
      </div>
      <div class="right">
        <button @click="$router.push('/login')">Sign in</button>
      </div>
    </div>

    <!-- 文档内容 -->
    <div class="content">
      <h1>Movie Hub 项目文档</h1>
      
      <section class="section">
        <h2>项目简介</h2>
        <p>Movie Hub 是一个电影管理系统，提供电影浏览、搜索、数据分析等功能。</p>
        <p>系统分为用户端和管理端两部分，用户可以浏览电影信息，管理员可以管理用户和电影数据。</p>
      </section>

      <section class="section">
        <h2>功能特性</h2>
        <ul>
          <li>电影浏览和搜索</li>
          <li>电影分类导航</li>
          <li>电影数据分析</li>
          <li>用户管理（管理员）</li>
          <li>电影数据管理（管理员）</li>
        </ul>
      </section>

      <section class="section">
        <h2>技术栈</h2>
        <ul>
          <li>前端：Vue 3 + TypeScript + Ant Design Vue</li>
          <li>后端：FastAPI + MySQL</li>
          <li>构建工具：Vite</li>
        </ul>
      </section>

      <section class="section">
        <h2>使用指南</h2>
        <h3>用户端</h3>
        <ol>
          <li>访问首页，点击 "Get Started" 或 "Sign in" 按钮</li>
          <li>输入用户名和密码进行登录</li>
          <li>登录后可以浏览电影列表，使用分类导航或搜索功能</li>
          <li>查看电影数据分析图表</li>
        </ol>
        
        <h3>管理端</h3>
        <ol>
          <li>使用管理员账号登录系统</li>
          <li>在管理中心可以管理用户和电影数据</li>
          <li>添加、编辑、删除用户和电影信息</li>
        </ol>
      </section>

      <section class="section">
        <h2>API 接口</h2>
        <p>系统提供以下主要 API 接口：</p>
        <ul>
          <li><strong>登录/注册</strong>：用户认证和注册</li>
          <li><strong>电影管理</strong>：获取电影列表、添加/编辑/删除电影</li>
          <li><strong>用户管理</strong>：获取用户列表、添加/编辑/删除用户</li>
          <li><strong>数据分析</strong>：获取电影数据统计信息</li>
        </ul>
      </section>

      <div class="footer">
        <button class="btn back" @click="$router.push('/')">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.documentation {
  width: 100vw;
  min-height: 100vh;
  background-color: #fdfdf9;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

/* 导航栏 */
.navbar {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  margin-top: 10px;
}

.left .logo {
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.right button {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #eee;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.right button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}

/* 文档内容 */
.content {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.content h1 {
  font-size: 32px;
  margin-bottom: 40px;
  text-align: center;
  transition: all 0.3s ease;
}

.content h1:hover {
  transform: translateY(-2px);
}

.section {
  margin-bottom: 40px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.section:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.section h2 {
  font-size: 24px;
  margin-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 8px;
  transition: all 0.3s ease;
}

.section h2:hover {
  transform: translateY(-2px);
}

.section h3 {
  font-size: 18px;
  margin: 20px 0 12px 0;
}

.section p {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #666;
}

.section ul {
  margin-bottom: 16px;
  padding-left: 24px;
}

.section li {
  margin-bottom: 8px;
  line-height: 1.5;
  color: #666;
}

.section ol {
  margin-bottom: 16px;
  padding-left: 24px;
}

.footer {
  margin-top: 40px;
  text-align: center;
  margin-bottom: 40px;
}

.btn {
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn.back {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
  box-shadow: 0 4px 16px rgba(168, 237, 234, 0.3);
}

.btn.back:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(168, 237, 234, 0.4);
  background: linear-gradient(135deg, #95dbd8 0%, #f9c4d2 100%);
}
</style>