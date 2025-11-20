import React from "react";
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { isAuthenticated, logout, navigate } = useAuthContext();

    return (
        <nav className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50">
            
            <h1 
                className="text-xl font-semibold cursor-pointer"
                onClick={() => navigate("/")}
            >
                MyApp
            </h1>

            <ul className="flex items-center gap-6 text-gray-700 font-medium">

                <li 
                    onClick={() => navigate("/")} 
                    className="cursor-pointer hover:text-indigo-600"
                >
                    Home
                </li>

                <li 
                    onClick={() => navigate("/chat")} 
                    className="cursor-pointer hover:text-indigo-600"
                >
                    Chat
                </li>

                {!isAuthenticated ? (
                    <li 
                        onClick={() => navigate("/login")} 
                        className="cursor-pointer hover:text-indigo-600"
                    >
                        Login
                    </li>
                ) : (
                    <li 
                        onClick={logout} 
                        className="cursor-pointer text-red-500 hover:text-red-600"
                    >
                        Logout
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
