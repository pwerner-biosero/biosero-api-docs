import React, { useEffect } from "react";
import { useAuth } from "@site/src/auth/AuthProvider";

export default function LogoutPage() {
  const { logout, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    logout();
  }, [logout, ready]);

  return <p>Signing you out…</p>;
}
