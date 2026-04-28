import axios from "axios";

/**
 * 忘记密码，重置密码
 * @param username 用户名
 * @param password 新密码
 * @param confirmPassword 确认新密码
 * @returns 重置密码响应数据
 */
async function forgetPassword(username: string, password: string, confirmPassword: string) {
  try {
    const response = await axios.post("/api/forgetPassword", { 
      username, 
      password, 
      confirm_password: confirmPassword 
    });
    return response.data;
  } catch (error) { 
    throw error; 
  }
}

export { forgetPassword };