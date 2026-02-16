import { AppSidebar, SidebarInset, SidebarProvider } from "@now/ui";
import { useAuth } from "@now/utils";
import { observer } from "mobx-react";
import { ReactNode, useEffect } from "react";

export const AppContainer = observer(function AppContainer({ children }: { children: ReactNode }) {
    const { refreshToken } = useAuth();
    useEffect(() => {
        refreshToken();
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
});
