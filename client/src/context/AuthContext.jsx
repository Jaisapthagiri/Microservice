import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        const access = localStorage.getItem("access");
        const storedUser = localStorage.getItem("user");

        if (access && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const res = await api.post("/login/", { email, password });

            const { access, refresh, user_id, email: userEmail, username } = res.data;

            // Save tokens
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);

            // Save complete user info
            const userObj = { id: user_id, email: userEmail, username };
            localStorage.setItem("user", JSON.stringify(userObj));

            setUser(userObj);
            setIsAuthenticated(true);

            toast.success("Logged in successfully!");
            navigate("/");

            return true;
        } catch (err) {
            toast.error("Invalid email or password");
            return false;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        setUser(null);
        setIsAuthenticated(false);

        toast.success("Logged out");
        navigate("/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                navigate,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);