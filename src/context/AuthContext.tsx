"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, reload } from "firebase/auth";
import { onAuthChanged } from "@/lib/auth";
import { getPlayer } from "@/lib/firestore";
import type { Player } from "@/types";

interface AuthContextType {
  user: User | null;
  player: Player | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  player: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Reload to ensure we have the latest profile including displayName
          await reload(firebaseUser);
          setUser(firebaseUser);

          const playerId = firebaseUser.displayName;
          if (playerId) {
            const playerData = await getPlayer(playerId);
            setPlayer(playerData);
          } else {
            setPlayer(null);
          }
        } catch (err) {
          console.error("Error fetching player:", err);
          setUser(firebaseUser);
          setPlayer(null);
        }
      } else {
        setUser(null);
        setPlayer(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, player, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
