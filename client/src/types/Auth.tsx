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

export interface UserInterface {
  name: string;
  email: string;
  slug?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  role?: string;
}
