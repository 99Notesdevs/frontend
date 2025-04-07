// import { cookies } from 'next/headers'
// import { env } from '@/config/env'
// export async function isAuth() {
//   try {
//     const token = (await cookies()).get('token')?.value
    
//     if (!token) {
//       return false
//     }

//     // Verify the token with your backend
//     const response = await fetch(`${env.API}/user/check`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })

//     return response.ok
//   } catch (error) {
//     return false
//   }
// }