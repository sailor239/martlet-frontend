import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { decodeToken } from "../utils/jwt"; // simple JWT decode helper
import { loginUser as apiLogin } from "../services/api";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      try {
        const decoded = decodeToken(storedToken);
        setUser({ username: decoded.sub });
        setToken(storedToken);
      } catch {
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const data = await apiLogin(username, password);
    localStorage.setItem("access_token", data.access_token);
    const decoded = decodeToken(data.access_token);
    setUser({ username: decoded.sub });
    setToken(data.access_token);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
