import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const noLayoutPages = ["/login", "/signin", "/admin/admin_dashboard","/admin/slots","/admin/update-form","/admin/offline_dashboard"];
  const shouldShowLayout = !noLayoutPages.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      {shouldShowLayout && <Navbar />}
      <Component {...pageProps} />
      {shouldShowLayout && <Footer />}
    </SessionProvider>
  );
}
