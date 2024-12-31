import { AppSidebar, SidebarInset, SidebarProvider } from "@now/ui";
import { useAuth, useStore } from "@now/utils";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";

export function AppContainer() {
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
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
