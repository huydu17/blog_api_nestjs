import React, { useEffect, useState } from "react";
import { ChangePassword, Logout } from "../../apicall/user";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../components/AppProvider";

export default function ChangePass() {
  const { updateLoginStatus } = useApp();
  const navigate = useNavigate();
  const [isChanged, setIsChanged] = useState(false);
  const [password, setPassword] = useState({
    oldPass: "",
    newPass: "",
    repeatPass: "",
  });
  useEffect(() => {
    setIsChanged(password.oldPass && password.newPass && password.repeatPass);
  }, [password.oldPass, password.newPass, password.repeatPass]);
  const handleChangePass = async () => {
    try {
      const data = {
        oldPassword: password.oldPass,
        newPassword: password.newPass,
      };
      const response = await ChangePassword(data);
      if (response.success) {
        toast.success("Cập nhật mật khẩu thành công!");
        setTimeout(async () => {
          await Logout();
          await updateLoginStatus();
          navigate("/login");
        }, 1500);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <div className="d-flex align-items-center justify-content-center pb-5">
      <div>
        <h5>Thay đổi mật khẩu</h5>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="d-flex flex-column gap-3 w-400">
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="current-password"
                placeholder="Mật khẩu cũ"
                onChange={(e) =>
                  setPassword({ ...password, oldPass: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="new-password"
                placeholder="Mật khẩu mới"
                onChange={(e) =>
                  setPassword({ ...password, newPass: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="repeat-password"
                placeholder="Nhập lại mật khẩu"
                onChange={(e) =>
                  setPassword({ ...password, repeatPass: e.target.value })
                }
              />
            </div>

            <div className="d-flex flex-column justify-content-end gap-2">
              <div>
                <button type="button" class="btn btn-secondary btn-sm">
                  Lấy lại mật khẩu
                </button>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn bg-primary text-white"
                  onClick={handleChangePass}
                  disabled={!isChanged}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
