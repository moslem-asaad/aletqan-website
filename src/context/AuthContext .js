// AuthContext.js
import { createContext, useContext, useState , useMemo } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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