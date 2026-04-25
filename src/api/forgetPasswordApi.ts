import axios from "axios";

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