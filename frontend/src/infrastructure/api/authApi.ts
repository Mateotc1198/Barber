import { solicitar } from "./clienteApi";

export const authApi = {
  login: (username: string, password: string): Promise<{ username: string }> =>
    solicitar<{ username: string }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  logout: (): Promise<void> =>
    solicitar<void>("/api/v1/auth/logout", { method: "POST" }),

  yo: (): Promise<{ username: string }> =>
    solicitar<{ username: string }>("/api/v1/auth/yo"),
};
