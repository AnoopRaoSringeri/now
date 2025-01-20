import { useAuth } from "@now/utils";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { Outlet } from "react-router";

export const Auth = observer(function Auth() {
    const { refreshToken } = useAuth();
    useEffect(() => {
        refreshToken();
    }, []);

    return (
        <div className="h-screen w-screen lg:grid  lg:grid-cols-2">
            <div className="hidden bg-muted lg:block"></div>
            <div className="flex items-center justify-center py-12">
                <Outlet />
            </div>
        </div>
    );
});
