import React from "react";
import { useAuth } from "../hooks/useAuth";
import { ShieldCheck, LogIn, LogOut, AlertCircle, RefreshCw, Sparkles, User, Database } from "lucide-react";

interface AuthBoundaryProps {
  children: React.ReactNode;
}

export const AuthBoundary: React.FC<AuthBoundaryProps> = ({ children }) => {
  const { authError, clearError } = useAuth();

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Optional Top Status Banner for Firebase Auth Errors */}
      {authError && (
        <div className="bg-amber-950/90 border-b border-amber-500/40 text-amber-200 px-4 py-2 text-xs font-mono flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{authError}</span>
          </div>
          <button
            onClick={clearError}
            className="text-stone-400 hover:text-stone-200 text-[10px] uppercase underline cursor-pointer"
          >
            Kuittaa
          </button>
        </div>
      )}

      {/* Render existing app children unconditionally so local system & UI remain 100% functional */}
      {children}
    </div>
  );
};

export const FirebaseAuthBadge: React.FC = () => {
  const { user, loading, isFirebaseAvailable, authError, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2 bg-stone-900/80 border border-stone-800 rounded-lg px-3 py-1.5 text-xs font-mono text-stone-400">
        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
        <span>Firebase alustetaan...</span>
      </div>
    );
  }

  if (!isFirebaseAvailable) {
    return (
      <div className="flex items-center gap-2 bg-stone-950/80 border border-stone-800/80 rounded-lg px-3 py-1.5 text-xs font-mono text-stone-400" title="Ympäristömuuttujat VITE_FIREBASE_* puuttuvat .env-tiedostosta">
        <div className="w-2 h-2 rounded-full bg-amber-500/50" />
        <span>Firebase: Paikallinen tila</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2.5 bg-stone-900/90 border border-amber-500/30 rounded-lg px-3 py-1.5 text-xs font-mono text-stone-200">
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || "User"} className="w-5 h-5 rounded-full border border-amber-500/40" />
        ) : (
          <User className="w-4 h-4 text-amber-400" />
        )}
        <div className="flex flex-col">
          <span className="text-amber-300 font-semibold truncate max-w-[120px]">{user.displayName || user.email}</span>
          <span className="text-[9px] text-emerald-400 flex items-center gap-1">
            <Database className="w-2.5 h-2.5" /> Cloud Firestore Sync
          </span>
        </div>
        <button
          onClick={signOut}
          className="ml-1 p-1 hover:bg-stone-800 rounded text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
          title="Kirjaudu ulos Firebase-tililtä"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg px-3 py-1.5 text-xs font-mono transition-all cursor-pointer shadow-md"
    >
      <LogIn className="w-3.5 h-3.5 text-amber-400" />
      <span>Kirjaudu Googlella</span>
    </button>
  );
};
