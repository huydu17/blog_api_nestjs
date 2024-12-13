import React, { useEffect, useState, createContext, useContext } from "react";
import toast from "react-hot-toast";
import { CheckLoginStatus, GetUser } from "../apicall/user";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const AppContext = createContext();

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkLogin = async () => {
    try {
      const response = await CheckLoginStatus();
      setIsLogin(response);
      if (!response) {
        navigate("/login");
      }
      return response;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };
  const updateLoginStatus = async () => {
    setLoading(true);
    const loggedIn = await checkLogin();
    if (loggedIn) {
      await getUser();
    }
    setLoading(false);
  };
  const getUser = async () => {
    try {
      const response = await GetUser();
      if (response.success) {
        setUser(response.data);
      } else {
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.message);
      navigate("/login");
    }
  };
  useEffect(() => {
    const init = async () => {
      const loggedIn = await checkLogin();
      if (loggedIn) {
        await getUser();
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <AppContext.Provider value={{ user, setUser, isLogin, updateLoginStatus }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
