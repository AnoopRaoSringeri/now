import { createContext, ReactNode, useContext } from "react";
import SketchStore from "../api-store/sketch-now-store";
import AuthStore from "../api-store/auth-store";
import UploadStore from "../api-store/upload-store";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60 * 5
        }
    }
});

const store = {
    authStore: new AuthStore(),
    sketchStore: new SketchStore(),
    uploadStore: new UploadStore()
};

const StoreContext = createContext(store);

const useStore = () => {
    return useContext(StoreContext);
};

const StoreProvider = ({ children }: { children: ReactNode }) => {
    const storeValue = useContext(StoreContext);
    return <StoreContext.Provider value={storeValue}>{children}</StoreContext.Provider>;
};
export { StoreProvider, useStore };
