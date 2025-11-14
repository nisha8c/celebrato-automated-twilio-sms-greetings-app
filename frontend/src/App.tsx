import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";

import { client } from "./apollo/client";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
    const [token, setToken] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    // Prevent rendering until token is checked
    useEffect(() => {
        const t = localStorage.getItem("token");
        setToken(t);
        setReady(true);
    }, []);

    // Prevent Dashboard from mounting early
    if (!ready) return null; // or a loading spinner

    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Dashboard */}
                    <Route
                        path="/dashboard"
                        element={token ? <Dashboard /> : <Navigate to="/login" />}
                    />

                    {/* Default redirect */}
                    <Route
                        path="*"
                        element={<Navigate to={token ? "/dashboard" : "/login"} />}
                    />
                </Routes>
            </BrowserRouter>
        </ApolloProvider>
    );
}
