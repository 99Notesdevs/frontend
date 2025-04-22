import Cookies from 'js-cookie'
import { env } from '@/config/env'

export interface AuthResponse {
  isAuthenticated: boolean;
  role: 'admin' | 'editor' | 'author' | null;
  userId: string | null;
}

export async function isAuth(): Promise<AuthResponse> {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return {
        isAuthenticated: false,
        role: null,
        userId: null
      }
    }

    // First, check the role
    const checkEndpoints = {
      admin: `${env.API}/admin/check`,
      editor: `${env.API}/editor/check`,
      author: `${env.API}/author/check`
    };

    // Try each endpoint in order of hierarchy (admin > editor > author)
    for (const [role, endpoint] of Object.entries(checkEndpoints)) {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isAuthenticated: true,
          role: role as 'admin' | 'editor' | 'author',
          userId: data.userId
        };
      }
    }

    // If none of the checks passed
    return {
      isAuthenticated: false,
      role: null,
      userId: null
    };

  } catch (error) {
    console.error('Error verifying authentication:', error);
    return {
      isAuthenticated: false,
      role: null,
      userId: null
    }
  }
}