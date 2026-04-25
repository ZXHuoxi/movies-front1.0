import axios from "axios";

// 添加用户
async function addUser(username: string, password: string, name: string, phone: string, email: string, role: string) {
  try {
    const response = await axios.post("/api/admin/add_user", {
      username,
      password,
      name,
      phone,
      email,
      role
    });

    let isSuccess = false;
    let errorMessage = '';
    
    // 支持两种返回格式
    if ('success' in response.data) {
      isSuccess = response.data.success;
      errorMessage = response.data.message;
    } else if ('code' in response.data) {
      isSuccess = response.data.code === 200;
      errorMessage = response.data.msg;
    }

    if (!isSuccess) {
      throw new Error(errorMessage || '添加用户失败，请检查输入信息');
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.msg || '添加用户失败，请检查输入信息';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('网络错误，请检查网络连接');
    } else {
      throw new Error(error.message || '添加用户失败，请检查输入信息');
    }
  }
}

/**
 * 获取用户列表
 * @param page 页码，默认1
 * @param size 每页数量，默认15
 * @returns 用户列表数据
 */
async function getUsers(page: number = 1, size: number = 15) {
  const response = await axios.get(`/api/admin/users`, {
    params: { page, size }
  });
  if (response.data && 'data' in response.data) {
    return response.data;
  }
  return { data: response.data };
}

/**
 根据用户名获取用户信息

 */
async function getUserInfo(username: string) {
  const response = await axios.get(`/api/admin/users`, {
    params: { page: 1, size: 100 }
  });

  const users = response.data.data || [];
  const user = users.find((u: any) => u.username === username);

  if (user) {
    return { data: user };
  } else {
    throw new Error('未找到用户信息');
  }
}
//修改密码
async function changePassword(oldPassword: string, newPassword: string) {
  const response = await axios.post(`/api/user/change-password`, {
    old_password: oldPassword,
    new_password: newPassword
  });
  return response.data;
}

//删除用户
async function deleteUser(id: number) {
  try {
    const response = await axios.post(`/api/auth/delete`, {
      id
    });

    let isSuccess = false;
    let errorMessage = '';

    if ('success' in response.data) {
      isSuccess = response.data.success;
      errorMessage = response.data.message;
    } else if ('code' in response.data) {
      isSuccess = response.data.code === 200;
      errorMessage = response.data.msg;
    }

    if (!isSuccess) {
      throw new Error(errorMessage || '删除用户失败，请检查输入信息');
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.msg || '删除用户失败，请检查输入信息';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('网络错误，请检查网络连接');
    } else {
      throw new Error(error.message || '删除用户失败，请检查输入信息');
    }
  }
}

/**
 *更新用户信息
 */
async function updateUser(id: number, username: string, password: string, name: string, phone: string, email: string, role: string) {
  try {
    const response = await axios.post(`/api/user/update`, {
      id,
      username,
      password,
      name,
      phone,
      email,
      role
    });

    let isSuccess = false;
    let errorMessage = '';

    if ('success' in response.data) {
      isSuccess = response.data.success;
      errorMessage = response.data.message;
    } else if ('code' in response.data) {
      isSuccess = response.data.code === 200;
      errorMessage = response.data.msg;
    }

    if (!isSuccess) {
      throw new Error(errorMessage || '修改用户失败，请检查输入信息');
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.msg || '修改用户失败，请检查输入信息';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('网络错误，请检查网络连接');
    } else {
      throw new Error(error.message || '修改用户失败，请检查输入信息');
    }
  }
}

export { addUser, getUsers, getUserInfo, changePassword, deleteUser, updateUser };