import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AppContextProviders } from "@/components";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContextProviders>
      <Component {...pageProps} />
    </AppContextProviders>
  );
}
