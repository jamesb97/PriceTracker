import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "../types";
import { v4 as uuidv4 } from "uuid";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => { success: boolean; error?: string };
  signUp: (name: string, email: string, password: string) => { success: boolean; error?: string };
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = "primetrack_users";
const SESSION_KEY = "primetrack_session";

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionUserId = localStorage.getItem(SESSION_KEY);
    if (sessionUserId) {
      const users = getStoredUsers();
      const found = users.find((u) => u.id === sessionUserId);
      if (found) setUser(found);
    }
    setIsLoading(false);
  }, []);

  const signUp = useCallback((name: string, email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) return { success: false, error: "Name is required." };
    if (!trimmedEmail) return { success: false, error: "Email is required." };
    if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };

    const users = getStoredUsers();
    if (users.some((u) => u.email === trimmedEmail)) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser: User = {
      id: uuidv4(),
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: simpleHash(password),
      createdAt: Date.now(),
    };

    saveUsers([...users, newUser]);
    localStorage.setItem(SESSION_KEY, newUser.id);
    setUser(newUser);
    return { success: true };
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const found = users.find((u) => u.email === trimmedEmail);

    if (!found) return { success: false, error: "No account found with this email." };
    if (found.passwordHash !== simpleHash(password)) {
      return { success: false, error: "Incorrect password." };
    }

    localStorage.setItem(SESSION_KEY, found.id);
    setUser(found);
    return { success: true };
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
