import { createContext, ReactNode, useContext } from "react";
import SketchStore from "../api-store/sketch-now-store";
import AuthStore from "../api-store/auth-store";
import UploadStore from "../api-store/upload-store";

const store = {
    authStore: new AuthStore(),
    sketchStore: new SketchStore(),
    uploadStore: new UploadStore()
};

const StoreContex = createContext(store);

const useStore = () => {
    return useContext(StoreContex);
};

const StoreProvider = ({ children }: { children: ReactNode }) => {
    const storeValue = useContext(StoreContex);
    return <StoreContex.Provider value={storeValue}>{children}</StoreContex.Provider>;
};
export { StoreProvider, useStore };
