import React, { useEffect, useState } from "react";
import SearchUser from "./components/SearchUser";
import Chat from "./components/Chat";
import UserList from "./components/UserList";
import Header from "./components/Header";
import { io } from "socket.io-client";
import { useApp } from "../components/AppProvider";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

export default function Home() {
  const [searchKey, setSearchKey] = useState("");
  const [selectChat, setSelectChat] = useState("");
  const [userOnline, setUserOnline] = useState([]);
  const navigate = useNavigate();
  const { user, isLogin } = useApp();
  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    if (user && user._id) {
      socket.emit("join-room", user._id);
      socket.emit("came-on", user._id);
      socket.on("user-online-updated", (data) => {
        console.log(data);
        setUserOnline(data);
      });
      socket.on("user-online", (data) => {
        setUserOnline(data);
      });
    }
    return () => {
      socket.off("user-online");
    };
  }, [user, isLogin, navigate]);
  console.log("olll", userOnline);
  return (
    <div className="background">
      {user && <Header socket={socket} />}
      <div className="home">
        <div className="user">
          <SearchUser searchKey={searchKey} setSearchKey={setSearchKey} />
          <UserList
            searchKey={searchKey}
            user={user}
            setSelectChat={setSelectChat}
            selectChat={selectChat}
            socket={socket}
            userOnline={userOnline}
            setSearchKey={setSearchKey}
          />
        </div>
        <div className="chat">
          {selectChat && (
            <Chat
              selectChat={selectChat}
              user={user}
              socket={socket}
              userOnline={userOnline}
            />
          )}
        </div>
      </div>
    </div>
  );
}
