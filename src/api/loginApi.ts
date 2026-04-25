import axios from "axios";

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @param role 角色
 * @returns 登录响应数据
 */
async function login(username: string, password: string, role: string) {
  try {
    if (!username || !password) {
      throw new Error('用户名和密码不能为空');
    }

    const response = await axios.post("/api/login", {
      username,
      password
    });

    let isSuccess = false;
    let errorMessage = '';
    let userData = null;

    // 处理不同格式的响应
    if ('success' in response.data) {
      isSuccess = response.data.success;
      errorMessage = response.data.message;
      userData = response.data.data;
    } else if ('code' in response.data) {
      isSuccess = response.data.code === 200;
      errorMessage = response.data.msg;
      userData = response.data.data;
    }

    if (!isSuccess) {
      throw new Error(errorMessage || '登录失败，请检查用户名和密码');
    }

    // 验证角色是否匹配
    const actualRole = userData?.role || 'user';
    if (role !== actualRole) {
      throw new Error(`角色选择错误，该账号的实际角色是${actualRole === 'admin' ? '管理员' : '用户'}`);
    }

    // 存储用户信息到本地存储
    const userInfo = {
      username: userData?.username || username,
      role: actualRole
    };
    localStorage.setItem('user', JSON.stringify(userInfo));
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.msg || '登录失败，请检查用户名和密码';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('网络错误，请检查网络连接');
    } else {
      throw new Error(error.message || '登录失败，请检查用户名和密码');
    }
  }
}

/**
 * 用户登出
 */
function logout() {
  localStorage.removeItem('user');
}

/**
 * 获取当前登录用户信息
 * @returns 用户信息对象或null
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export { login, logout, getCurrentUser };