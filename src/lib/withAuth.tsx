"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { env } from "@/config/env";
import LoadingSpinner from "@/components/Loading/loading";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        const token = Cookies.get("token");

        // If no token, redirect to login page
        if (!token) {
          router.push("/operator");
          return;
        }

        // Validate the token with the server
        try {
          const response = await fetch(`${env.API}/admin/check`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            // If token is invalid, redirect to login page
            router.push("/operator");
            Cookies.remove("token");
            return;
          }

          // If token is valid, allow access
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error during authentication check:", error);
          router.push("/operator");
          Cookies.remove("token");
        }
      };

      checkAuth();
    }, [router]);

    // Show a loading spinner or nothing while checking authentication
    if (!isAuthenticated) {
      return <LoadingSpinner />; // Replace with a spinner or skeleton loader if needed
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
