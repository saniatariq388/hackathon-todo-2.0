// store and read Better-Auth session token
export function getSessionToken() {
  if (typeof window === "undefined") return null;

  const session = JSON.parse(localStorage.getItem("better-auth-session") || "null");
  return session?.session?.token || null;
}
