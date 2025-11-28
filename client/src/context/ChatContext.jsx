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
    if (!user?.id) return;

    try {
      const token = localStorage.getItem("access");
      if (!token) return;

      const res = await api.get("/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const others = res.data
        .filter((u) => u.id !== user.id)
        .map((u) => ({ _id: u.id.toString(), name: u.username }));

      setUsers(others);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  // Fetch users on mount or when user changes
  useEffect(() => {
    getUsers();
  }, [user]);

  // 2️⃣ Initialize Socket.IO connection
  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem("access");
    if (!token) return;

    const s = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    setSocket(s);

    // Listen online users
    s.on("onlineUsers", (ids) => {
      const others = ids.map(String).filter((id) => id !== user.id.toString());
      setOnlineUsers(others);
    });

    // Listen incoming messages
    const handleMessage = (msg) => {
      setMessages((prev) => {
        const chatId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        const prevMsgs = prev[chatId] || [];

        // Remove temp version of this message if it exists
        const filteredMsgs = prevMsgs.filter(
          (m) => !(m._temp && m.text === msg.text && m.senderId === msg.senderId)
        );

        return {
          ...prev,
          [chatId]: [...filteredMsgs, msg],
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
      const res = await nodeApi.get(`/api/chat/messages/${otherUser._id}`);
      setMessages((prev) => ({
        ...prev,
        [otherUser._id]: res.data || [],
      }));
    } catch (err) {
      console.log("Error loading chat:", err);
      setMessages((prev) => ({
        ...prev,
        [otherUser._id]: [],
      }));
    }
  };

  // 4️⃣ Send message
  const sendMessage = async (receiverId, text) => {
    if (!text.trim() || !user?.id) return;

    // Create a temporary message object for instant display
    const newMsg = { senderId: user.id, receiverId, text, createdAt: new Date(), _temp: true };

    // Optimistically update UI
    setMessages((prev) => {
      const prevMsgs = prev[receiverId] || [];
      return {
        ...prev,
        [receiverId]: [...prevMsgs, newMsg],
      };
    });

    try {
      await nodeApi.post("/api/chat/send", { receiverId, text });
      // no need to update again; socket will emit
    } catch (err) {
      console.log("Send message error:", err);
      // Optionally remove temporary message on error
      setMessages((prev) => {
        const prevMsgs = prev[receiverId] || [];
        return {
          ...prev,
          [receiverId]: prevMsgs.filter((m) => m._temp !== true || m.text !== text),
        };
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        onlineUsers,
        selectedUser,
        setSelectedUser: openChat,
        messages,
        sendMessage,
        users,
        getUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
export const useChat = () => useContext(ChatContext);
