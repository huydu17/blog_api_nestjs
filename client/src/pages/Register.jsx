import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { RegisterUser } from "../apicall/user";
import { useApp } from "../components/AppProvider";

export default function Register() {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { isLogin, updateLoginStatus } = useApp();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await RegisterUser(user);
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
        <form onSubmit={handleRegister}>
          <div className="d-flex flex-column gap-3 w-400">
            <input
              placeholder="Họ tên"
              value={user.name}
              onChange={(e) => setUser({ ...user, userName: e.target.value })}
            />
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
              type="submit"
              className={`${
                user.email && user.password && user.userName
                  ? "outlined-btn"
                  : "disable-btn"
              }`}
            >
              Đăng ký
            </button>
            <Link to="/login" className="underline">
              Đã có tài khoản? Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
