import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const isAuthenticated = !!token;

  useEffect(() => {
    
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);

    
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);  
    setToken(token);  
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);   
  };

  const getUser = () => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error("Invalid token:", e);
      return null;
    }
  };

  return { isAuthenticated, login, logout, getUser };
};

export default useAuth;
