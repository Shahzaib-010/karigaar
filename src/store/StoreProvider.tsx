"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";

import { makeStore } from "@/src/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazy initializer creates the store exactly once per client instance.
  const [store] = useState(makeStore);

  // Enables refetchOnFocus / refetchOnReconnect and pauses polling while the
  // tab is unfocused. Returns an unsubscribe used for cleanup.
  useEffect(() => setupListeners(store.dispatch), [store]);

  return <Provider store={store}>{children}</Provider>;
}
