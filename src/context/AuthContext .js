// AuthContext.js
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const GetUserName = () => {
  const { user } = useAuth();

  const userName = useMemo(() => {
    console.log("Gender value is:", `"${user.gender}"`);
    if (user.gender === "MALE") {
      return " الأستاذ " + user.name;
    } else {
      return " المعلمة " + user.name;
    }
  }, [user.gender, user.name]);

  return userName;
};
