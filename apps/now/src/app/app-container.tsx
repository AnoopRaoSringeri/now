import { AppSidebar, SidebarInset, SidebarProvider } from "@now/ui";
import { useAuth } from "@now/utils";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Outlet } from "react-router";

export const AppContainer = observer(function AppContainer() {
    const { refreshToken } = useAuth();
    useEffect(() => {
        refreshToken();
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
});
