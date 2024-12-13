import React, { useEffect, useRef, useState } from "react";
import { GetAllMessages, NewMessage } from "../../apicall/message";
import toast from "react-hot-toast";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";
import { getAvatarLetter } from "../../utils/getAvatarLetter";
import { formatDate } from "../../utils/formatDate";
export default function Chat({ selectChat, user, socket, userOnline }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const lastTypingTime = useRef(null);

  const receiver = selectChat?.members?.find((mem) => mem._id !== user._id);
  //create message
  const handleNewMessage = async (e, file = null) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("chat", selectChat._id);
      formData.append("sender", user._id);
      formData.append("text", message);
      let isFileValid = true;
      if (file) {
        // Kiểm tra kích thước file (ví dụ: giới hạn 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.");
          isFileValid = false;
        } else {
          formData.append("file", file);
        }
      }
      if (isFileValid) {
        if (file) {
          toast.loading("Đang tải ảnh lên...");
        }
        const response = await NewMessage(formData);
        if (response.success) {
          const newMsg = {
            chat: selectChat._id,
            sender: user._id,
            text: message,
            image: response.data.image,
            isRead: false,
            createdAt: new Date().toISOString(),
          };
          // Emit socket event
          socket.emit("send-message", {
            ...newMsg,
            members: selectChat.members.map((mem) => mem._id),
          });
          // Cập nhật UI
          setMessage("");
          setShowEmoji(false);
          toast.dismiss();
        }
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.message);
    }
  };
  //get message
  const getMsgs = async () => {
    try {
      const response = await GetAllMessages(selectChat._id);
      if (response.success) {
        setMessages(response.data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  //format day
  const formatMessageDate = (date) => {
    const now = moment();
    const messageDate = moment(date);
    if (now.diff(messageDate, "days") === 0) {
      return messageDate.format("HH:mm");
    } else {
      return messageDate.format("HH:mm DD/MM/YY");
    }
  };

  //hook clear unread message and seen message
  useEffect(() => {
    if (selectChat) {
      getMsgs();
      const handleMessageReceive = (message) => {
        if (selectChat._id === message.chat) {
          setMessages((prev) => [...prev, message]);
        }
      };
      const clearUnreadAndSeenMsg = (data) => {
        setMessages((prevMsg) => {
          return prevMsg?.map((msg) => {
            if (selectChat._id === data.chat) {
              return {
                ...msg,
                isRead: true,
              };
            }
            return msg;
          });
        });
      };
      const handleTyping = (data) => {
        if (selectChat._id === data.chat && data.sender !== user._id) {
          setTyping(true);
          lastTypingTime.current = new Date().getTime();
        }
      };
      socket.on("receive-message", handleMessageReceive);
      socket.on("typing-res", handleTyping);
      socket.on("clear-unread-msg-res", clearUnreadAndSeenMsg);
      return () => {
        socket.off("receive-message", handleMessageReceive);
        socket.off("typing-res", handleTyping);
        socket.off("clear-unread-msg-res", clearUnreadAndSeenMsg);
      };
    }
  }, [selectChat, socket, user]);

  //send image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      handleNewMessage(e, file);
    }
  };
  useEffect(() => {
    const typingTimer = setInterval(() => {
      if (lastTypingTime.current) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastTypingTime.current;
        if (timeDiff >= 750 && typing) {
          setTyping(false);
          lastTypingTime.current = null;
        }
      }
    }, 100);
    return () => clearInterval(typingTimer);
  }, [typing]);
  //handle scroll bottom
  const handleScrollBotton = () => {
    const messageContainer = document.getElementById("message");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  };
  // hook scroll when has new message
  useEffect(() => {
    handleScrollBotton();
  }, [messages, typing]);

  return (
    <div className="chat-area">
      <div className="d-flex">
        {receiver.profilePic ? (
          <img
            src={receiver.profilePic}
            alt={receiver.userName}
            className="image-avatar"
          />
        ) : (
          <span className="name">{getAvatarLetter(receiver.userName)}</span>
        )}
        <div>
          <span className="text-2xl">{receiver.userName}</span>

          <p style={{ fontSize: "small" }}>
            {userOnline && userOnline?.includes(receiver._id)
              ? "Đang hoạt động"
              : "Ngoại tuyến"}
          </p>
        </div>
      </div>
      <hr></hr>
      <div className="message-area" id="message">
        {messages.map((msg) => {
          const userCurrent = msg.sender === user._id;
          return (
            <div key={msg._id} className={`message ${userCurrent && "right"}`}>
              <div className="message-container">
                {msg.text && (
                  <div
                    className={`message-text ${
                      userCurrent ? "bg-right" : "bg-left"
                    } ${msg?.text?.length > 400 ? "long" : ""}`}
                  >
                    <span
                      className={`${
                        userCurrent ? "message-right" : "message-left"
                      } ${msg.text.length > 400 ? "long" : ""}`}
                    >
                      {msg.text}
                    </span>
                  </div>
                )}
                <div className="bg-image">
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="imagee"
                      onLoad={handleScrollBotton}
                      style={{
                        width: "200px",
                        height: "auto",
                        borderRadius: "3px",
                      }}
                    />
                  )}
                </div>
                {userCurrent && (
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "end",
                    }}
                  >
                    {msg.isRead ? (
                      <i className="ri-checkbox-circle-fill"></i>
                    ) : (
                      <i className="ri-checkbox-circle-line"></i>
                    )}
                  </span>
                )}
              </div>
              <span style={{ fontSize: "small", paddingRight: "17px" }}>
                {formatMessageDate(msg.createdAt)}
              </span>
            </div>
          );
        })}
        {typing && <span className="typing">đang nhập...</span>}
      </div>
      {showEmoji && (
        <div className="emoji">
          <EmojiPicker
            width={300}
            height={350}
            onEmojiClick={(e) => {
              setMessage(message + e.emoji);
            }}
          />
        </div>
      )}
      <form className="input-message" onSubmit={(e) => handleNewMessage(e)}>
        <div className="icon">
          <label htmlFor="file">
            <i className="ri-folder-image-line cursor-pointer"></i>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              accept="image/gif, image/jpeg, image/jpg, image/png"
              onChange={handleSendImage}
            />
          </label>
          <i
            className="ri-emotion-happy-line"
            onClick={() => setShowEmoji(!showEmoji)}
          ></i>
        </div>
        <input
          placeholder="Nhập tin nhắn"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit("typing", {
              chat: selectChat._id,
              members: selectChat.members.map((mem) => mem._id),
              sender: user._id,
            });
          }}
        />
        <button type="submit" className="send-message">
          <i className="ri-send-plane-2-fill"></i>
        </button>
      </form>
    </div>
  );
}
