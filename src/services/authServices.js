const getCurrentUser = () => {
  let token = localStorage.getItem("token");
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
