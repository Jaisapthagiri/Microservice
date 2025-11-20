import React, { useEffect } from "react";
import Sidebar from "../component/Sidebar";
import ChatWindow from "../component/ChatWindow";
import { useChatContext } from "../context/ChatContext";

const Chat = () => {
    const { getUsers } = useChatContext();

    useEffect(() => {
        getUsers(); 
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <ChatWindow />
        </div>
    );
};

export default Chat;
