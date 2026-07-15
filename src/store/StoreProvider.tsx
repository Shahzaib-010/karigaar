"use client";

import { useState } from "react";
import { Provider } from "react-redux";

import { makeStore } from "@/src/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazy initializer creates the store exactly once per client instance.
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
