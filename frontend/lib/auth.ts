export function isLoggedIn(): boolean {
  return typeof window !== "undefined" && !!localStorage.getItem("token");
}

export function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}
