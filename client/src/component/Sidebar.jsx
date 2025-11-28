import React from "react";
import { useChat } from "../context/ChatContext";

const Sidebar = () => {
  const { users, selectedUser, setSelectedUser: openChat, onlineUsers } = useChat();

  if (!users || users.length === 0) {
    return (
      <div className="w-64 border-r h-full flex items-center justify-center text-gray-500 bg-white">
        No users available
      </div>
    );
  }

  return (
    <div className="w-64 border-r h-full overflow-y-auto bg-white">
      <h2 className="p-4 font-semibold text-lg border-b">Chats</h2>

      {users.map((u) => {
        const isOnline = onlineUsers.includes(u._id);

        return (
          <div
            key={u._id}
            onClick={() => openChat(u)}
            className={`p-3 cursor-pointer flex justify-between items-center ${
              selectedUser?._id === u._id ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <span className="font-medium">{u.name}</span>
            {isOnline && <span className="w-3 h-3 bg-green-500 rounded-full"></span>}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
