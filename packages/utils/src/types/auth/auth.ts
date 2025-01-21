export interface LogInRequet {
    username: string;
    password: string;
    email: string;
    avatar?: string;
}

export type User = LogInRequet;
