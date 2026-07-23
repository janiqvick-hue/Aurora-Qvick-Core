import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, isConfigValid, initializationError } from "../firebase/firebaseConfig";
import { signInWithGoogle, signOut } from "../firebase/authService";
import { bootstrapUser } from "../firebase/userService";

export interface AuthContextType {
  user: User | null;
  userId: string | null;
  loading: boolean;
  authError: string | null;
  isFirebaseAvailable: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(initializationError);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // Safety timeout to ensure loading state clears within 2 seconds
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          try {
            await bootstrapUser({
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
            });
            setUser(currentUser);
            setAuthError(null);
          } catch (bootstrapErr: unknown) {
            const err = bootstrapErr as Error;
            setAuthError(`Käyttäjädokumentin luonti epäonnistui: ${err.message}`);
            setUser(currentUser); // User is authenticated even if Firestore fails
          }
        } else {
          setUser(null);
        }
      } catch (err: unknown) {
        console.error("Auth listener error:", err);
      } finally {
        clearTimeout(safetyTimer);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === "auth/popup-closed-by-user") {
        setAuthError("Kirjautuminen peruutettiin (ikkuna suljettiin).");
      } else {
        setAuthError(error.message || "Virhe Google-kirjautumisessa.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
      setAuthError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setAuthError(error.message || "Virhe uloskirjautumisessa.");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user ? user.uid : null,
        loading,
        authError,
        isFirebaseAvailable: isConfigValid,
        signInWithGoogle: handleSignIn,
        signOut: handleSignOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
