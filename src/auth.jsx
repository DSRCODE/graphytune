// src/auth.js
export const isAuthenticated = () => {
  return localStorage.getItem("adminToken");
};

export const login = () => {
  localStorage.setItem("adminToken", "mock_token");
};

export const logout = () => {
  localStorage.removeItem("adminToken");
};
