import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import {useMutation} from "@apollo/client/react";

// 🔹 GraphQL mutations
const REGISTER = gql`
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
    $phoneNumber: String!
  ) {
    register(
      name: $name
      email: $email
      password: $password
      phoneNumber: $phoneNumber
    )
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

// 🔹 TypeScript interfaces for mutation responses and variables
interface RegisterResponse {
    register: string;
}

interface RegisterVars {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
}

interface LoginResponse {
    login: string;
}

interface LoginVars {
    email: string;
    password: string;
}

interface Props {
    type: "login" | "register";
}

// 🔹 Main AuthForm component
export const AuthForm: React.FC<Props> = ({ type }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
    });

    // ✅ Typed Apollo hooks
    const [register] = useMutation<RegisterResponse, RegisterVars>(REGISTER);
    const [login] = useMutation<LoginResponse, LoginVars>(LOGIN);

    // ✅ Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let token: string | undefined;

            if (type === "register") {
                const res = await register({ variables: formData });
                token = res.data?.register;
            } else {
                const res = await login({
                    variables: {
                        email: formData.email,
                        password: formData.password,
                    },
                });
                token = res.data?.login;
            }

            if (!token) throw new Error("No token returned from server");

            localStorage.setItem("token", token);
            navigate("/dashboard");
        } catch (err) {
            console.error("Auth error:", err);
            alert("Invalid credentials or registration error.");
        }
    };

    // ✅ UI
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-blue-900 p-4">
            <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-white">
                    {type === "login" ? "Welcome Back 🎉" : "Create Account 🎂"}
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {type === "register" && (
                        <>
                            <input
                                className="p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white"
                                placeholder="Full Name"
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                            <input
                                className="p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white"
                                placeholder="Phone Number"
                                onChange={(e) =>
                                    setFormData({ ...formData, phoneNumber: e.target.value })
                                }
                            />
                        </>
                    )}

                    <input
                        className="p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white"
                        placeholder="Email"
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        className="p-3 rounded-lg bg-white/20 placeholder-gray-300 text-white"
                        placeholder="Password"
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                    />

                    <button
                        type="submit"
                        className="p-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
                    >
                        {type === "login" ? "Login" : "Register"}
                    </button>
                </form>

                <div className="text-center text-gray-300 mt-4">
                    {type === "login" ? (
                        <p>
                            Don’t have an account?{" "}
                            <span
                                className="text-pink-400 cursor-pointer"
                                onClick={() => navigate("/register")}
                            >
                Sign up
              </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <span
                                className="text-pink-400 cursor-pointer"
                                onClick={() => navigate("/login")}
                            >
                Sign in
              </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
