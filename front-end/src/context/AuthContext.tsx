import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { User, AuthContextType } from "../types/index.js";
import api from "../api/axios.js";

const initialState: AuthContextType = {
  user: null,
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(initialState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchProfile(token);
  }, [token]);

  const fetchProfile = async (jwtToken: string) => {
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
      const response = await api.get("/users/profile");
      setUser(response.data.user as User);
    } catch (err) {
      console.error("Token validation failed, logging out.", err);
      localStorage.removeItem("token");
      setToken(null);
      delete api.defaults.headers.common["Authorization"];
    } finally {
      setIsLoading(false);
    }
  };

  const login = (jwtToken: string, userData: User) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    setUser(userData);
    api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      token,
      login,
      logout,
    }),
    [user, token]
  );

  if (isLoading)
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading Application...
      </div>
    );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
