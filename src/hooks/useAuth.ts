import { useContext } from "react";
import { AuthContext, AuthContextType } from "../contexts/AuthContext";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth -koukkua on käytettävä AuthProvider-kontekstin sisällä.");
  }
  return context;
}
