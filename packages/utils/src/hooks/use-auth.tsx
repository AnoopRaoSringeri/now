import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { LogInRequet } from "../types/auth/auth";
import { useStore } from "./store-provider";
import { useToast } from "@now/ui";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const { authStore } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("IsAuthenticated");
    const { toast } = useToast();

    const refreshToken = async () => {
        if (isAuthenticated === "true") {
            const res = await authStore.IsValidSession();
            if (!res) {
                endSession();
            } else {
                authStore.IsSessionValid = true;
                const redirectURL = localStorage.getItem("RedirectURL");
                if (redirectURL) {
                    navigate(redirectURL);
                    localStorage.removeItem("RedirectURL");
                }
            }
        } else {
            endSession();
        }
    };

    const endSession = () => {
        if (location.pathname !== "/auth" && location.pathname !== "/") {
            localStorage.setItem("RedirectURL", location.pathname);
        }
        localStorage.removeItem("IsAuthenticated");
        toast({ variant: "destructive", description: "Session expired login again" });
        authStore.IsSessionValid = false;
        navigate("/auth");
    };

    const logOut = async () => {
        await authStore.Logout();
        localStorage.removeItem("IsAuthenticated");
        authStore.IsSessionValid = false;
        navigate("/");
        toast({ variant: "destructive", description: "User logged out successfully" });
    };

    const logIn = async (values: LogInRequet) => {
        setLoading(true);
        const response = await authStore.Login(values);
        if (response) {
            toast({ variant: "default", description: "Logged in successfully" });
            localStorage.setItem("IsAuthenticated", "true");
            authStore.IsSessionValid = true;
            const redirectURL = localStorage.getItem("RedirectURL");
            if (redirectURL) {
                navigate(redirectURL);
                localStorage.removeItem("RedirectURL");
            } else {
                navigate("/sketch-now");
            }
        } else {
            toast({ variant: "destructive", description: "User login failed" });
        }
        setLoading(false);
    };

    const register = async (values: LogInRequet) => {
        setLoading(true);
        const res = await authStore.Register(values);
        if (res) {
            toast({ variant: "default", description: "User registered successfully" });
            navigate("/auth");
        } else {
            toast({ variant: "destructive", description: "User registration failed" });
        }
        setLoading(false);
    };

    const forgotPassword = async (email: string) => {
        setLoading(true);
        const res = await authStore.ForgotPassword(email);
        if (res) {
            toast({ variant: "default", description: "Forgot password link has been sent to the email" });
        } else {
            toast({ variant: "destructive", description: "Forgot password failed" });
        }
        setLoading(false);
    };

    return { register, logOut, logIn, loading, refreshToken, forgotPassword, isAuthenticated, user: authStore.User };
}
