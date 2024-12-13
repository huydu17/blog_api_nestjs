import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../apicall/user";
import toast from "react-hot-toast";
import { useApp } from "../components/AppProvider";
export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { isLogin, updateLoginStatus } = useApp();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await LoginUser(user);
      if (response.success) {
        toast.success(response.message);
        await updateLoginStatus();
        navigate("/");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
      navigate("/login");
    }
  };
  useEffect(() => {
    if (isLogin) {
      navigate("/");
      return;
    }
  }, [isLogin, navigate]);
  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#4d426d" }}
    >
      <div className="bg-white shadow-lg p-5 rounded gap-3">
        <h3 className="text-2xl font-weight-bold text-uppercase text-center">
          Chat App
        </h3>
        <hr />
        <form onSubmit={handleLogin}>
          <div className="d-flex flex-column gap-3 w-400">
            <input
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button
              className={`${
                user.email && user.password ? "outlined-btn" : "disable-btn"
              }`}
              type="submit"
            >
              Đăng nhập
            </button>
            <Link to="/register" className="underline">
              Chưa có tài khoản? Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
