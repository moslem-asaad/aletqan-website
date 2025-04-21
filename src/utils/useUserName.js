import { useAuth } from "../context/AuthContext ";
import { useMemo } from "react";

export const useUserName = () => {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) return "";
    const gender = user.gender?.trim().toUpperCase();
    console.log(gender); 
    return gender === "MALE" ? "الأستاذ " + user.name : "المعلمة " + user.name;
  }, [user]);
};
