import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isUser = router.pathname.startsWith('/users');
  const isDashboard = router.pathname.startsWith('/dashboard');

  if (isUser || isDashboard) {
    return <Component {...pageProps} />;
  }


  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}