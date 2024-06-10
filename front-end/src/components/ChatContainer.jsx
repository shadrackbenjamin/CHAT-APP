import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import ChatLists from "./ChatLists";
import InputText from "./InputText";
import UserLogin from "./UserLogin";
import socketIOClient from "socket.io-client";

const ChatContainer = () => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const socketio = socketIOClient("http://localhost:3002");

    socketio.on("chat", (chats) => {
      setChats(chats);
    });

    socketio.on('message', (msg) => {
      setChats((prevChats) => [...prevChats, msg]);
    });

    return () => {
      socketio.disconnect();
    };
  }, []);

  const addMessage = (chat) => {
    const newChat = {
      username: localStorage.getItem("user"),
      message: chat,
      avatar: localStorage.getItem("avatar"),
    };
    const socketio = socketIOClient("http://localhost:3002");
    socketio.emit('newMessage', newChat);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem('avatar');
    setUser('');
  };

  return (
    <div>
      {user ? (
        <div className="home">
          <div className="chats_header">
            <h4>Username: {user}</h4>
            <p>
              <FaWhatsapp className="chats_icon" /> Angel chat app
            </p>
            <p className="chats_logout" onClick={logout}>
              <strong>Logout</strong>
            </p>
          </div>
          <ChatLists chats={chats} />
          <InputText addMessage={addMessage} />
        </div>
      ) : (
        <UserLogin setUser={setUser} />
      )}
    </div>
  );
};

export default ChatContainer;
