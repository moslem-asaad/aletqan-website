
export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };
  
  export const getUserInfo = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };
  