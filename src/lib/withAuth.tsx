"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "@/config/api/route";
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
          const response = (await api.get(`/admin/check`)) as {
            success: boolean;
          };
          console.log(response);
          if (!response.success) {
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
