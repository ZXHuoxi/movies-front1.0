<template>
  <div class="home">
    <!-- 顶部导航 -->
    <div class="navbar">
      <div class="left">
        <span class="logo">🎬 Movie Hub</span>
      </div>
      <div class="center">
      </div>
      <div class="right">
        <button @click="$router.push('/login')">Sign in</button>
      </div>
    </div>

    <!-- 中间内容 -->
    <div class="hero">
      <h1>Welcome to Movie Hub</h1>
      <p>Discover amazing movies anytime, anywhere.</p>

      <div class="buttons">
        <button class="btn dark" @click="$router.push('/login')">Get Started</button>
        <button class="btn light" @click="$router.push('/documentation')">Documentation</button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 首页组件
 * 显示网站欢迎页面，包含导航栏和主要内容区域
 */
</script>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  background-color: #fdfdf9;
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.center {
  display: flex;
  gap: 30px;
}

.center a {
  font-size: 15px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.center a:hover {
  color: #111;
}

.center a:hover::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
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

/* 中间内容 */
.hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 20px;
}

.hero h1 {
  font-size: 42px;
  margin: 0;
  transition: all 0.3s ease;
}

.hero h1:hover {
  transform: translateY(-2px);
}

.hero p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.buttons {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn.dark {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
  box-shadow: 0 4px 16px rgba(168, 237, 234, 0.3);
}

.btn.dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(168, 237, 234, 0.4);
  background: linear-gradient(135deg, #95dbd8 0%, #f9c4d2 100%);
}

.btn.light {
  background: white;
  color: #333;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.btn.light:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}
</style>