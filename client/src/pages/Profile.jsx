import React, { useEffect, useState } from "react";
import { useApp } from "../components/AppProvider";
import { UpdateProfilePic } from "../apicall/user";
import toast from "react-hot-toast";
import Header from "./components/Header";
import UpdateProfile from "./components/UpdateProfile";
import ChangePass from "./components/ChangePass";
import UpdateAvatar from "./components/UpdateAvatar";

export default function Profile() {
  return (
    <div>
      <Header />
      <div className="d-flex justify-content-center gap-2">
        <div>
          <UpdateProfile />
          <ChangePass />
        </div>
        <div>
          <UpdateAvatar />
        </div>
      </div>
    </div>
  );
}
