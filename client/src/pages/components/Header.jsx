import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../components/AppProvider";
import { Logout } from "../../apicall/user";
import toast from "react-hot-toast";
import { getAvatarLetter } from "../../utils/getAvatarLetter";
export default function Header({ socket }) {
  const { user, updateLoginStatus } = useApp();
  console.log(user._id);
  const [isShow, setIsShow] = useState(true);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await Logout();
      await updateLoginStatus();
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };
  useEffect(() => {
    setIsShow(false);
  }, [user]);
  return (
    <div className="header">
      <div className="layout">
        <div
          className="text-4xl font-weight-bold text-uppercase cursor-pointer"
          onClick={() => navigate("/")}
        >
          <i className="ri-message-3-line"></i> ChatApp
        </div>
        <div className="avartar-profile">
          {user?.profilePic ? (
            <img
              src={user?.profilePic}
              alt="avatar"
              onClick={() => setIsShow(!isShow)}
            />
          ) : (
            <span
              className="name cursor-pointer"
              onClick={() => setIsShow(!isShow)}
            >
              {getAvatarLetter(user?.userName)}
            </span>
          )}

          {isShow && (
            <div className="setting">
              <div onClick={() => navigate("/profile")}>
                <i class="ri-user-3-line"></i> Hồ sơ
              </div>
              <div
                onClick={() => {
                  socket.emit("went-offline", {
                    userId: user._id,
                    timeOff: new Date(),
                  });
                  handleLogout();
                }}
              >
                <i class="ri-logout-circle-r-line"></i> Đăng xuất
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
