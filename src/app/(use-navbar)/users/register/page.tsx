// "use client";
// import React, { useState, useEffect } from "react";
// import { env } from "@/config/env";
// import { isAuth } from "@/lib/isAuth";
// import { api } from "@/config/api/route";

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [password, setPassword] = useState("");
//   const [repeatPassword, setRepeatPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

//   const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const auth = await isAuth();
//       if (auth.isAuthenticated && auth.role === 'user') {
//         window.location.href = `${env.TEST_PORTAL}/dashboard`;
//       }
//     };
//     checkAuth();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== repeatPassword) {
//       showToast("Passwords do not match!", "warning");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const response = await api.post(`/user/signup`, {
//         email,
//         firstName,
//         lastName,
//         password,
//       }) as { success: boolean; message?: string; data?: any };
//       if (response.success) {
//         const data = response.data;
//         if (!data) {
//           showToast("No token received from server. Please try again later.", "error");
//           return;
//         }
//         window.location.href = `${env.TEST_PORTAL}/dashboard`;
//         showToast("Registration successful!", "success");
//       } else {
//         showToast(response.data.message, "error");
//       }
//     } catch (error) {
//       setLoading(false);
//       console.log(error);
//       showToast("Registration failed. Please try again later.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 px-4 sm:px-6 py-12 transition-colors duration-200">
//       <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg dark:shadow-slate-900/30 border border-gray-200 dark:border-slate-700">
//         <div>
//           <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
//             Create an account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
//             Join our community today
//           </p>
//         </div>

//         {toast && (
//           <div
//             className={`p-4 rounded-lg ${
//               toast.type === "success"
//                 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
//                 : toast.type === "warning"
//                 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
//                 : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
//             }`}
//           >
//             <p className="text-sm text-center">{toast.message}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
//                 First name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 id="firstName"
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 required
//                 className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white sm:text-sm transition-colors"
//                 placeholder="John"
//               />
//             </div>

//             <div>
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
//                 Last name
//               </label>
//               <input
//                 id="lastName"
//                 type="text"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white sm:text-sm transition-colors"
//                 placeholder="Doe"
//               />
//             </div>
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
//               Email address <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white sm:text-sm transition-colors"
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
//               Password <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 autoComplete="new-password"
//                 required
//                 className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white sm:text-sm transition-colors pr-10"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 dark:text-slate-500 dark:hover:text-slate-400"
//               >
//                 {showPassword ? (
//                   <svg
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     className="h-5 w-5"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>

//           <div>
//             <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
//               Confirm Password <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="repeatPassword"
//               type={showPassword ? "text" : "password"}
//               value={repeatPassword}
//               onChange={(e) => setRepeatPassword(e.target.value)}
//               required
//               className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white sm:text-sm transition-colors"
//               placeholder="••••••••"
//             />
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary)] hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating account...
//                 </>
//               ) : 'Create account'}
//             </button>
//           </div>

//           <div className="text-center text-sm">
//             <p className="text-gray-600 dark:text-slate-400">
//               Already have an account?{' '}
//               <a href="/users/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
//                 Sign in
//               </a>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;
