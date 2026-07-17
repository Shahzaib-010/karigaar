// Shared "live data" tuning for RTK Query hooks.
//
// True push (a client's booking instantly appearing on the admin dashboard in
// another browser) needs the backend to broadcast events over WebSockets. Until
// that exists, we keep every live view fresh with two cheap, backend-free
// mechanisms:
//   1. refetchOnFocus / refetchOnReconnect (set on each createApi) — the moment
//      you return to the tab or the network comes back, data re-fetches.
//   2. a short polling interval on the hooks below, paused while the tab is
//      unfocused so we don't hammer the API in the background.
//
// Spread `livePolling` into a query hook's options to opt it in.
export const LIVE_POLL_MS = 12_000;

export const livePolling = {
  pollingInterval: LIVE_POLL_MS,
  skipPollingIfUnfocused: true,
} as const;
