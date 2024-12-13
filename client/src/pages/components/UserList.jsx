import React, { useEffect, useState, useCallback } from "react";
import { GetUsers } from "../../apicall/user";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import { getAvatarLetter } from "../../utils/getAvatarLetter";
import {
  ClearUnreadMessage,
  CreateNewChat,
  GetAllChats,
} from "../../apicall/chat";

export default function UserList({
  searchKey,
  user,
  setSelectChat,
  selectChat,
  socket,
  userOnline,
  setSearchKey,
}) {
  const [users, setUsers] = useState([]);
  const [allChats, setAllChats] = useState([]);
  //get user
  const getUsers = async () => {
    try {
      const response = await GetUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  //get chat
  const getAllChat = useCallback(async () => {
    try {
      const response = await GetAllChats();
      if (response.success) {
        setAllChats(response.data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  //clear unread message
  const clearUnreadMsg = async (chatId) => {
    try {
      if (selectChat?.members?.length >= 2) {
        socket.emit("clear-unread-msg-req", {
          chat: chatId,
          members: selectChat.members.map((mem) => mem._id),
        });
      }
      const response = await ClearUnreadMessage(chatId);
      if (response.success) {
        setAllChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === chatId ? { ...chat, unreadMessage: 0 } : chat
          )
        );
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  //create and open chat
  const createAndOpenChatHandle = async (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userId)
    );
    if (!chat) {
      try {
        const members = {
          members: [userId, user._id],
        };
        const response = await CreateNewChat(members);
        if (response.success) {
          const newChat = response.data;
          socket.emit("update-user-list", {
            members: response.data.members.map((mem) => mem._id),
            newChat,
          });
          setSelectChat(newChat);
          setSearchKey("");
        }
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      setSelectChat(chat);
    }
  };
  //check select
  const selected = (userId) => {
    if (selectChat) {
      return selectChat?.members?.map((mem) => mem._id).includes(userId);
    }
    return false;
  };

  //diplay last message
  const lastMessage = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userId)
    );
    if (chat && chat.lastMessage) {
      const checkMsg = chat.lastMessage?.sender === userId;
      return checkMsg ? (
        <div className="last-message">
          {`${
            chat?.lastMessage?.text
              ? chat?.lastMessage?.text?.length > 20
                ? chat?.lastMessage?.text.slice(0, 20) + "..."
                : chat?.lastMessage?.text
              : "Đã gửi 1 ảnh"
          }`}
          <span style={{ float: "right" }}>
            {formatDate(chat?.lastMessage?.createdAt)}
          </span>
        </div>
      ) : (
        <div className="last-message">
          {`${
            chat?.lastMessage?.text
              ? `Bạn: ${
                  chat?.lastMessage?.text?.length > 16
                    ? chat?.lastMessage?.text.slice(0, 16) + "..."
                    : chat?.lastMessage?.text
                } `
              : "Bạn: Đã gửi 1 ảnh"
          }`}

          <span style={{ float: "right" }}>
            {formatDate(chat?.lastMessage?.createdAt)}
          </span>
        </div>
      );
    } else {
      return "";
    }
  };

  //get unread messaage
  const getUnreadMessage = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((mem) => mem._id).includes(userId)
    );
    if (
      chat &&
      chat.unreadMessage > 0 &&
      chat?.lastMessage?.sender !== user._id
    ) {
      return <span className="unread-msg">{chat.unreadMessage}</span>;
    } else {
      return "";
    }
  };
  //get data
  const getData = () => {
    if (searchKey === "") {
      return allChats;
    }
    return users.filter((user) =>
      user?.userName.toLowerCase().includes(searchKey.toLowerCase())
    );
  };

  useEffect(() => {
    const handleUpdateUserList = (data) => {
      setAllChats((prev) => {
        return [data?.newChat, ...prev];
      });
    };
    socket.on("update-user-list-res", handleUpdateUserList);
    return () => {
      socket.off("update-user-list-res", handleUpdateUserList);
    };
  }, [socket]);

  //hook update last message and amount unread message
  useEffect(() => {
    const handleLastMessageAndUnread = async (data) => {
      setAllChats((prevChats) => {
        const updateAllChats = prevChats.map((chat) => {
          if (chat?._id === data.chat) {
            return {
              ...chat,
              unreadMessage:
                selectChat && selectChat._id === data.chat
                  ? 0
                  : chat.unreadMessage + 1,
              lastMessage: data,
            };
          }
          return chat;
        });
        return updateAllChats.sort((a, b) => {
          if (a.lastMessage && b.lastMessage) {
            return (
              new Date(b.lastMessage.createdAt) -
              new Date(a.lastMessage.createdAt)
            );
          }
          return 0;
        });
      });

      if (selectChat?._id === data.chat && data.sender !== user._id) {
        clearUnreadMsg(data.chat);
      }
    };
    socket.on("receive-message", handleLastMessageAndUnread);
    return () => {
      socket.off("receive-message", handleLastMessageAndUnread);
    };
  }, [selectChat, user, socket]);
  //hook clear unread message and seen message
  useEffect(() => {
    if (
      selectChat?.unreadMessage > 0 &&
      selectChat?.lastMessage?.sender !== user._id
    ) {
      clearUnreadMsg(selectChat._id);
    }
  }, [selectChat]);

  useEffect(() => {
    getUsers();
    getAllChat();
  }, [getAllChat]);
  console.log("ol", userOnline);
  return (
    <div className="user-list">
      {getData().map((chatObjUserObj) => {
        let userObj = chatObjUserObj;
        if (chatObjUserObj?.members) {
          userObj = chatObjUserObj?.members.find((mem) => mem._id !== user._id);
        }
        return (
          userObj && (
            <div key={userObj._id}>
              <div
                className={`list-user shadow-sm rounded-3 position-relative bg-white p-3 cursor-pointer ${
                  selected(userObj._id) && "selectedChat"
                }`}
                onClick={() => createAndOpenChatHandle(userObj._id)}
              >
                {userObj.profilePic ? (
                  <img
                    src={userObj.profilePic}
                    alt={userObj.userName}
                    className="image-avatar"
                  />
                ) : (
                  <div className="name">
                    {getAvatarLetter(userObj.userName)}
                  </div>
                )}
                <div className="user-name">
                  <span className="text-2xl">
                    {userObj.userName}{" "}
                    {userOnline && userOnline?.includes(userObj._id) && (
                      <span className="online"></span>
                    )}
                    {getUnreadMessage(userObj._id)}
                    {lastMessage(userObj._id)}
                  </span>
                </div>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
}
