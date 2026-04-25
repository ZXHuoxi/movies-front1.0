import axios from "axios";

// 注册请求
async function register(username: string, password: string, confirmPassword: string, name: string, phone: string, email: string) {
  try {
    const response = await axios.post("/api/register", {
      username,
      password,
      confirm_password: confirmPassword,
      name,
      phone,
      email,
      role: "user"
    });

    let isSuccess = false;
    let errorMessage = '';

    if ('success' in response.data) {
      isSuccess = response.data.success;
      errorMessage = response.data.message;
    } else if ('code' in response.data) {
      isSuccess = response.data.code === 200;
      if (isSuccess && response.data.data === "注册成功") {
        errorMessage = "注册成功";
      } else {
        errorMessage = response.data.msg;
      }
    }

    if (!isSuccess) {
      throw new Error(errorMessage || '注册失败，请检查输入信息');
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          const errorMessages = error.response.data.detail.map((item: any) => item.msg || item.message || JSON.stringify(item)).join('; ');
          throw new Error(errorMessages || '注册失败，请检查输入信息');
        } else {
          throw new Error(error.response.data.detail || '注册失败，请检查输入信息');
        }
      }
      const errorMessage = error.response.data?.message || error.response.data?.msg || '注册失败，请检查输入信息';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('网络错误，请检查网络连接');
    } else {
      throw new Error(error.message || '注册失败，请检查输入信息');
    }
  }
}

export { register };