import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { client } from "./apollo/client";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import {ApolloProvider} from "@apollo/client/react";

export default function App() {
    const token = localStorage.getItem("token");

    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={token ? <Dashboard /> : <Navigate to="/login" />}
                    />
                    <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
                </Routes>
            </BrowserRouter>
        </ApolloProvider>
    );
}
