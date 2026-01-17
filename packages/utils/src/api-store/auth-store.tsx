import axios, { AxiosResponse } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../types/auth/auth";

export const BaseUrl = import.meta.env.VITE_SKETCH_NOW_URL;

export const getRequestConfig = (withCredentials?: boolean) => {
    return {
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        withCredentials: withCredentials
    };
};

class AuthStore {
    user: User | null = null;
    constructor() {
        makeAutoObservable(this);
    }
    isSessionValid = false;

    get IsSessionValid() {
        return this.isSessionValid;
    }

    set IsSessionValid(value: boolean) {
        runInAction(() => {
            this.isSessionValid = value;
        });
    }

    get User() {
        return this.user;
    }

    async Login({
        username,
        password,
        email
    }: {
        username: string;
        password: string;
        email: string;
    }): Promise<{ token: string } | null> {
        try {
            const { data }: AxiosResponse<{ token: string }> = await axios.post(
                `${BaseUrl}login`,
                {
                    username,
                    email,
                    password
                },
                getRequestConfig(true)
            );
            runInAction(() => {
                this.user = {
                    email,
                    password,
                    username
                };
            });
            return data;
        } catch (e) {
            return null;
        }
    }

    async Logout(): Promise<boolean> {
        try {
            await axios.get(`${BaseUrl}logout`, getRequestConfig(true));
            return true;
        } catch (e) {
            return false;
        }
    }

    async Register({
        username,
        password,
        email
    }: {
        username: string;
        password: string;
        email: string;
    }): Promise<boolean> {
        try {
            await axios.post(
                `${BaseUrl}register`,
                {
                    username,
                    email,
                    password
                },
                getRequestConfig()
            );
            return true;
        } catch (e) {
            return false;
        }
    }

    async ForgotPassword(email: string): Promise<boolean> {
        try {
            await axios.post(
                `${BaseUrl}forgotPassword`,
                {
                    email
                },
                getRequestConfig()
            );
            return true;
        } catch (e) {
            return false;
        }
    }

    async IsValidSession(): Promise<boolean> {
        try {
            const { data }: AxiosResponse<User | null> = await axios.get(`${BaseUrl}`, getRequestConfig(true));
            runInAction(() => {
                this.user = data;
            });
            return data != null;
        } catch (e) {
            return false;
        }
    }
}

export default AuthStore;
