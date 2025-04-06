import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';
import { env } from '@/config/env';
import axios from 'axios';

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: string; // token
}

interface TokenValidationResponse {
  success: boolean;
  message?: string;
}

const API_BASE = `${env.API}/user`;

async function validateToken(token: string): Promise<TokenValidationResponse> {
  try {
    const response = await axios.get(`${API_BASE}/check`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.data.success) {
      throw new Error('Token validation failed: ' + (response.data.message || 'Unknown error'));
    }
    
    return {
      success: true,
      message: 'Token is valid'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Token validation failed with status: ${error.response?.status}`);
      console.error('Error data:', error.response?.data);
    }
    throw error;
  }
}

export async function isAuth(): Promise<boolean> {
  const token = Cookies.get('token');
  
  if (!token) {
    return false;
  }

  try {
    const response = await validateToken(token);
    return response.success;
  } catch (error) {
    return false;
  }
}

export const isNotAuth = (Component: React.ComponentType) => {
  const token = Cookies.get('userToken');
  
  if (token) {
    redirect('/users/dashboard');
  }
  
  return Component;
};


export const checkUser = async () => {
  try {
    const token = Cookies.get('token');
    if (token) {
      const res = await axios.get(`${API_BASE}/check`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data.success) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking user authentication:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.warn("Unauthorized! Clearing token...");
        Cookies.remove('token');
        return false;
      }
      console.error("API Error:", error.response?.status, error.response?.data);
    } else {
      console.error("Unexpected Error:", error);
    }
    return false;
  }
};

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE}/login`, {
      email,
      password,
    });

    if (response.data.success) {
      const token = response.data.data;
      if (!token) {
        throw new Error('No token received from server');
      }
      
      Cookies.set('token', token, { expires: 5 });
      return true;
    }
    
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};