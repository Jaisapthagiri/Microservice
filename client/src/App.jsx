import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="px-5 md:px-10 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
