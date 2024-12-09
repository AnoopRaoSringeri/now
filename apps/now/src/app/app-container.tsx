import { AppSidebar, SidebarInset, SidebarProvider } from "@now/ui";
import { Outlet } from "react-router";

export function AppContainer() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
