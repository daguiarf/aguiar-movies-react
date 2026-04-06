"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import { decodeJwt } from "@/lib/jwt";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded) {
        store.dispatch(setUser(decoded));
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
