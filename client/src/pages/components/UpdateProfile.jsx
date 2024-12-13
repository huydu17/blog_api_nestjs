import React, { useState, useEffect } from "react";
import { useApp } from "../../components/AppProvider";
import toast from "react-hot-toast";
import { UpdateUser } from "../../apicall/user";

export default function UpdateProfile() {
  const { user, setUser } = useApp();
  const [infoUser, setInfoUser] = useState(user);
  const [isChanged, setIsChanged] = useState(false);
  console.log(infoUser);
  const handleUpdateUser = async () => {
    try {
      const data = { userName: infoUser.userName };
      const response = await UpdateUser(data);
      if (response.success) {
        toast.success(response.message);
        setUser({ ...user, userName: response.data.userName });
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  useEffect(() => {
    setIsChanged(infoUser?.userName !== user?.userName);
  }, [infoUser?.userName, user?.userName]);
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="p-5 rounded gap-3">
        <h5>Cập nhật thông tin</h5>
        <form>
          <div className="d-flex flex-column gap-3 w-400">
            <div className="form-group">
              <input
                className="form-control"
                id="email"
                placeholder="Email"
                value={user?.email}
                disabled
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Họ tên"
                value={infoUser?.userName}
                onChange={(e) =>
                  setInfoUser({ ...infoUser, userName: e.target.value })
                }
              />
            </div>
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn bg-primary text-white"
                disabled={!isChanged}
                onClick={handleUpdateUser}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
