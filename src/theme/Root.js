// src/theme/Root.js
import React from "react";
import { AuthProvider } from "@site/src/auth/AuthProvider";

export default function Root({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
