import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client";
import nodeApi from "../api/nodeApi";
import api from "../api/axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuthContext();

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);

  // 1️⃣ Fetch all users from Django

  const getUsers = async () => {
    if (!user?.userId) return;

    try {
      const token = localStorage.getItem("access");
      if (!token) return;

      const res = await api.get("/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const others = res.data
        .filter((u) => u.id !== user.userId)
        .map((u) => ({ _id: u.id, name: u.username }));

      setUsers(others);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!user?.userId || !token) return;
    getUsers();
  }, [user]);

  // 2️⃣ Connect to Node Socket.IO

  useEffect(() => {
    if (!user?.userId) return;

    const token = localStorage.getItem("access");
    if (!token) return;

    const s = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    setSocket(s);

    // Online users

    s.on("getConnection", (ids) => {
      const others = ids.filter((id) => id !== user.userId);
      setOnlineUsers(others);
    });

    const handleMessage = (msg) => {
      setMessages((prev) => {
        const chatId = msg.senderId === user.userId ? msg.receiverId : msg.senderId;

        const prevMsgs = prev[chatId] || [];

        const exists = prevMsgs.some(
          (m) =>
            m.text === msg.text &&
            new Date(m.createdAt).getTime() === new Date(msg.createdAt).getTime()
        );
        if (exists) return prev;

        return {
          ...prev,
          [chatId]: [...prevMsgs, msg],
        };
      });
    };

    s.on("receiveMessage", handleMessage);

    return () => {
      s.off("receiveMessage", handleMessage);
      s.disconnect();
    };
  }, [user]);

  // 3️⃣ Open chat and load messages

  const openChat = async (otherUser) => {
    setSelectedUser(otherUser);

    try {
      const res = await nodeApi.get(`/api/chat/messages/${otherUser._id}`, {
        params: { senderId: user.userId },
      });

      setMessages((prev) => ({
        ...prev,
        [otherUser._id]: res.data,
      }));
    } catch (err) {
      console.log("Error loading chat:", err);
    }
  };

  // 4️⃣ Send message

  const sendMessage = async (receiverId, text) => {
    if (!text.trim() || !user?.userId) return;

    const newMsg = { senderId: user.userId, receiverId, text, createdAt: new Date() };

    try {
      await nodeApi.post("/api/chat/send", newMsg);
    } catch (err) {
      console.log("Send message error:", err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket, onlineUsers, selectedUser, setSelectedUser: openChat,
        messages, sendMessage, users, getUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
export const useChat = () => useContext(ChatContext); 
