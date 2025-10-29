import Cookies from "js-cookie";
import { env } from "../config/env";

export interface AuthResponse {
  isAuthenticated: boolean;
  role: "admin" | "editor" | "author" | "user" | null;
  userId: number | null;
}

export async function isAuth(): Promise<AuthResponse> {
  try {
    // const token = Cookies.get("token");

    // if (!token) {
    //   return {
    //     isAuthenticated: false,
    //     role: null,
    //     userId: null,
    //   };
    // }

    // First, check the role
    const checkEndpoints = {
      admin: `/admin/check`,
      editor: `/editor/check`,
      author: `/author/check`,
      user: `/user/check`,
    };

    // Try each endpoint in order of hierarchy (admin > editor > author)
    for (const [role, endpoint] of Object.entries(checkEndpoints)) {
      let response;
      let userData;
      if(role === "user") {
          response = await fetch(`${env.API_AUTH}${endpoint}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          credentials: "include",
        });
        const responseUser = await fetch(`${env.API_AUTH}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        credentials: "include",
      });
        userData = await responseUser.json() as {
          success: boolean;
          data: { id: number };
        };
        return {
          isAuthenticated: true,
          role: role as "admin" | "editor" | "author" | "user",
          userId: Number(userData.data.id),
        };
      }
      else {
        response = await fetch(`${env.API}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        credentials: "include",
      });
    }
      const data = await response.json() as {
        success: boolean;
        data: { userId: string };
      };

      if (data.success) {
        return {
          isAuthenticated: true,
          role: role as "admin" | "editor" | "author" | "user",
          userId: Number(data.data.userId),
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
