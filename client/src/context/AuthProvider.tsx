import { AuthContext } from "./AuthContext";
import { useAuth } from "@/hook/Auth/useAuth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
