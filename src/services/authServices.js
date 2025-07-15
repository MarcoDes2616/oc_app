import * as SecureStore from "expo-secure-store";

const getCurrentUser = async() => {
  const token = await SecureStore.getItemAsync("user_token");
  return token
};

const actionLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload();
};

const authService = {
  getCurrentUser,
  actionLogout
};

export default authService;
