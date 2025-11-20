import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const access = localStorage.getItem("access");
        const username = localStorage.getItem("username");
        const userId = localStorage.getItem("userId");

        if (access && username) {
            setUser({ username,userId });
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.post("/login/", { username, password });

            const access = res.data.access;
            const refresh = res.data.refresh;
            const userId = res.data.user_id; 

            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);
            localStorage.setItem("username", username);
            localStorage.setItem("userId", userId);  

            setUser({ username, userId });
            setIsAuthenticated(true);

            toast.success("Logged in successfully!");
            navigate("/");
            return true;
        } catch (err) {
            toast.error("Invalid username or password");
            return false;
        }
    };


    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        localStorage.removeItem("userId"); 

        setUser(null);
        setIsAuthenticated(false);

        toast.success("Logged out");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{
            user, isAuthenticated, login, logout, navigate
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
