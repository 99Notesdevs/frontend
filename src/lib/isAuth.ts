import Cookies from 'js-cookie'
import { env } from '@/config/env'
export async function isAuth() {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return false
    }

    // Verify the token with your backend
    const response = await fetch(`${env.API}/user/check`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    return response.ok
  } catch (error) {
    return false
  }
}