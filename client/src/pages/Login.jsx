import React, { useState } from "react";
import api from "../api/axios";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
    const { login } = useAuthContext();
    const [state, setState] = useState("login");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (state === "login") {

            const success = await login(formData.email, formData.password);

            if (!success) {
                toast.error("Invalid email or password");
            }

        } else {
            // REGISTER
            try {
                await api.post("/register/", {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });

                toast.success("Account created! Logging in...");

                await login(formData.email, formData.password);

            } catch (err) {
                toast.error("Registration failed");
            }
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white shadow-md"
        >
            <h1 className="text-gray-900 text-3xl mt-10 font-semibold">
                {state === "login" ? "Login" : "Sign Up"}
            </h1>

            <p className="text-gray-500 text-sm mt-2">Please enter your details</p>

            {/* USERNAME (only for register) */}
            {state === "register" && (
                <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="border-none outline-none ring-0 w-full"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
            )}

            {/* EMAIL */}
            <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border-none outline-none ring-0 w-full"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* PASSWORD */}
            <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border-none outline-none ring-0 w-full"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <button
                type="submit"
                className="mt-5 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity font-medium"
            >
                {state === "login" ? "Login" : "Sign Up"}
            </button>

            <p
                onClick={() => setState(prev => prev === "login" ? "register" : "login")}
                className="text-gray-500 text-sm mt-4 mb-11 cursor-pointer"
            >
                {state === "login" ? "Don't have an account?" : "Already have an account?"}
                <span className="text-indigo-500 hover:underline ml-1">Click here</span>
            </p>
        </form>
    );
};

export default Login;
