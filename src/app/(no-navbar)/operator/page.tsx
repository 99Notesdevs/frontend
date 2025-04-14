"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { env } from "../../../config/env";
import Cookies from "js-cookie";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${env.API}/admin`, {
        email: username,
        password,
        secretKey: secret,
      });
      if (response.data.success) {
        Cookies.set("token", response.data.data.token, { expires: 5 });
        router.push("/dashboard");
      } else {
        setError("Using wrong credentials");
      }
    } catch (error) {
      console.log(error);
      setError("Using wrong credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-white px-4 sm:px-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-[340px] sm:max-w-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          ADMIN LOGIN
        </h2>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm sm:text-base">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Email"
                className="w-full text-sm text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-yellow-400 pl-10 pb-1 transition-all duration-300 focus:border-b-2 focus:scale-x-100 transform origin-center"
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full text-sm text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-yellow-400 pl-10 pb-1 transition-all duration-300 focus:border-b-2 focus:scale-x-100 transform origin-center"
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a9 9 0 0112.364 0M1.636 9.636a12 12 0 0116.728 0M12 19c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
                  ></path>
                </svg>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 leading-5 text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
                placeholder="Secret Key"
                className="w-full text-sm text-gray-800 bg-transparent border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-yellow-400 pl-10 pb-1 transition-all duration-300 focus:border-b-2 focus:scale-x-100 transform origin-center"
              />
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a9 9 0 0112.364 0M1.636 9.636a12 12 0 0116.728 0M12 19c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"
                  ></path>
                </svg>
              </span>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 leading-5 text-xs"
              >
                {showSecret ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-white py-2.5 rounded-lg hover:bg-yellow-500 transition duration-200 font-medium text-sm"
          >
            Login
          </button>
        </form>
        <div>
          <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <a
              href="/"
              className="text-sm text-gray-500 font-semibold hover:text-yellow-500 transition duration-200"
            >
              Go back to 99Notes
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
