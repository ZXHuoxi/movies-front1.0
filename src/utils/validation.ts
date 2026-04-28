/**
 * 表单错误信息接口
 */
export interface FormErrors {
  username?: string; // 用户名错误信息
  password?: string; // 密码错误信息
  confirmPassword?: string; // 确认密码错误信息
  role?: string; // 角色错误信息
  name?: string; // 姓名错误信息
  phone?: string; // 手机号错误信息
  email?: string; // 邮箱错误信息
}

/**
 * 表单数据接口
 */
export interface FormData {
  username: string; // 用户名
  password: string; // 密码
  confirmPassword: string; // 确认密码
  role: string; // 角色
  name: string; // 姓名
  phone: string; // 手机号
  email: string; // 邮箱
}