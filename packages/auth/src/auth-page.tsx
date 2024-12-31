import { useAuth, useStore } from "@now/utils";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";

export const Auth = observer(function Auth() {
    const { authStore } = useStore();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (isAuthenticated === "true") {
            refreshToken();
        } else {
            navigate("/auth");
        }
    }, [isAuthenticated]);

    const refreshToken = async () => {
        const res = await authStore.IsValidSession();
        if (!res) {
            navigate("/auth");
            localStorage.removeItem("IsAuthenticated");
            toast.error("Session expired login again");
            authStore.IsSessionValid = false;
        } else {
            authStore.IsSessionValid = true;
        }
    };

    return (
        <div className="h-screen w-screen lg:grid  lg:grid-cols-2">
            <div className="hidden bg-muted lg:block"></div>
            <div className="flex items-center justify-center py-12">
                <Outlet />
            </div>
        </div>
    );
});
