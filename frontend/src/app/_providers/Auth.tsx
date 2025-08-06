"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  refetchUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const refetchUser = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      {
        credentials: "include",
      }
    );

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  };

  useEffect(() => {
    refetchUser();
  }, []);

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
