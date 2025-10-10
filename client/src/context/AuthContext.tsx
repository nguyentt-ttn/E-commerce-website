import { createContext } from "react";
import type { UserInterface } from "@/types/Auth";

export interface AuthContextType {
  user: UserInterface | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: UserInterface, jwtToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
