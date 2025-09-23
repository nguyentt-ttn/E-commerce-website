export interface RegsiterInterface {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
    address?: string;
}

export interface LoginInterface {
    email: string;
    password: string;
}