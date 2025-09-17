"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

interface JwtPayload {
  id: number;
  name: string;
  email: string;
  companyId?: number;
  exp?: number; // ✅ include expiry timestamp
}

interface User {
  id: number;
  name: string;
  email: string;
  companies_id?: number;
}

interface UserContextType {
  user: User | null;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  logout: () => {},
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const decoded = jwt.decode(token) as JwtPayload | null;

      // ✅ Check expiry
      if (!decoded?.exp || decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setUser(null);
        return router.push("/login");
      }

      if (decoded?.id && decoded?.email && decoded?.name) {
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          companies_id: decoded.companyId,
        });
      }
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <UserContext.Provider value={{ user, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
