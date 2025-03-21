import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith('/dashboard');
  const isLogin = router.pathname.startsWith('/login');

  if (isDashboard || isLogin) {
    return <Component {...pageProps} />;
  }


  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}