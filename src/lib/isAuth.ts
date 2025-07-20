import Cookies from "js-cookie";
import { api } from "@/config/api/route";

export interface AuthResponse {
  isAuthenticated: boolean;
  role: "admin" | "editor" | "author" | "user" | null;
  userId: string | null;
}

export async function isAuth(): Promise<AuthResponse> {
  try {
    const token = Cookies.get("token");

    if (!token) {
      return {
        isAuthenticated: false,
        role: null,
        userId: null,
      };
    }

    // First, check the role
    const checkEndpoints = {
      admin: `/admin/check`,
      editor: `/editor/check`,
      author: `/author/check`,
      user: `/user/check`,
    };

    // Try each endpoint in order of hierarchy (admin > editor > author)
    for (const [role, endpoint] of Object.entries(checkEndpoints)) {
      const response = (await api.get(endpoint)) as {
        success: boolean;
        data: { userId: string };
      };

      if (response.success) {
        return {
          isAuthenticated: true,
          role: role as "admin" | "editor" | "author" | "user",
          userId: response.data.userId,
        };
      }
    }

    // If none of the checks passed
    return {
      isAuthenticated: false,
      role: null,
      userId: null,
    };
  } catch (error) {
    console.error("Error verifying authentication:", error);
    return {
      isAuthenticated: false,
      role: null,
      userId: null,
    };
  }
}
