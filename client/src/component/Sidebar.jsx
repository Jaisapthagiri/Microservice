import React from "react";
import { useChat } from "../context/ChatContext";

const Sidebar = () => {
  const { users, selectedUser, setSelectedUser: openChat, onlineUsers } = useChat();

  return (
    <div className="w-64 border-r h-full overflow-y-auto bg-white">
      <h2 className="p-4 font-semibold text-lg">Chats</h2>

      {users.length === 0 && (
        <div className="p-4 text-gray-500">No users available</div>
      )}

      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => openChat(u)}
          className={`p-3 cursor-pointer flex justify-between items-center
            ${selectedUser?._id === u._id ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          <span>{u.name}</span>
          {onlineUsers.includes(u._id) && (
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
