import React, { useState, useRef, useEffect } from "react";
import { useChatContext } from "../context/ChatContext";
import { useAuthContext } from "../context/AuthContext";

const ChatWindow = () => {
  const { user } = useAuthContext();
  const { selectedUser, messages, sendMessage } = useChatContext();

  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const msgs = selectedUser ? messages[selectedUser._id] || [] : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  if (!selectedUser)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to chat
      </div>
    );

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(selectedUser._id, text);
    setText("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b font-semibold bg-white">{selectedUser.name}</div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {msgs.map((m, idx) => (
          <div
            key={m._id || idx}
            className={`p-2 mb-2 rounded-lg max-w-xs ${
              m.senderId === user.userId
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-white border"
            }`}
          >
            {m.text}
            <div className="text-xs opacity-70 mt-1">
              {new Date(m.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={handleSend} className="p-4 border-t bg-white flex">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 mr-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
