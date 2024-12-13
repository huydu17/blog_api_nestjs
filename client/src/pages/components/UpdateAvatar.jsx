import React, { useEffect, useState } from "react";
import { useApp } from "../../components/AppProvider";
import toast from "react-hot-toast";
import { UpdateProfilePic } from "../../apicall/user";

export default function UpdateAvatar() {
  const { user, setUser } = useApp();
  const [preview, setPreview] = useState(user?.profilePic);
  const updateProfile = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      toast.loading("Đang tải ảnh lên");
      const response = await UpdateProfilePic(formData);
      setUser({ ...user, profilePic: response.data.profilePic });
      setPreview(response.data.profilePic);
      toast.dismiss();
      toast.success("Cập nhật thành công");
    } catch (err) {
      toast.error(err.message);
    }
  };
  useEffect(() => {
    if (user?.profilePic) {
      setPreview(user.profilePic);
    }
  }, [user]);
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ paddingLeft: "70px" }}
    >
      <div className="pt-5 rounded gap-3">
        {preview ? (
          <img
            src={preview}
            alt="avatar"
            style={{ width: "250px", height: "250px", borderRadius: "50%" }}
          />
        ) : (
          <img
            src="/avatar.png"
            alt="avatar"
            style={{ width: "250px", height: "250px", borderRadius: "50%" }}
          />
        )}
      </div>
      <div className="pt-2">
        <label className="cursor-pointer">
          <span>
            <i className="ri-edit-2-fill"></i> Chỉnh sửa
          </span>
          <input
            type="file"
            onChange={(e) => {
              updateProfile(e.target.files[0]);
            }}
            style={{ display: "none" }}
          />
        </label>
      </div>
    </div>
  );
}
