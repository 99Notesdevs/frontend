import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith('/dashboard');
  const isLogin = router.pathname.startsWith('/login');
  const isUserLogin = router.pathname.startsWith('/users/login');
  const isUserRegister = router.pathname.startsWith('/users/register');

  return (
    <ErrorBoundary>
      {isDashboard || isLogin || isUserLogin || isUserRegister ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </ErrorBoundary>
  );
}