import "src/locales/i18n";

// scroll bar
import "simplebar/src/simplebar.css";
import "assets/style/globals.scss";

// ----------------------------------------------------------------------
import { useEffect } from "react";
import { useRouter } from "next/router";

// next
import Head from "next/head";
import type { AppProps } from "next/app";
// theme
import ThemeConfig from "src/theme";
// contexts
import { SettingsProvider } from "src/contexts/SettingsContext";
// components
import RtlLayout from "src/components/RtlLayout";
import Settings from "src/components/settings";
import TopProgressBar from "src/components/TopProgressBar";
import ThemePrimaryColor from "src/components/ThemePrimaryColor";
import NotistackProvider from "src/components/NotistackProvider";
import Users from "api/Users";
import useLocalStorage from "src/hooks/useLocalStorage";

// ----------------------------------------------------------------------

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = useRouter();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    if (pathname !== "/500") {
      Users.checkLogin(router);
    }
  }, []);

  return (
    <SettingsProvider>
      <ThemeConfig>
        <ThemePrimaryColor>
          <RtlLayout>
            <NotistackProvider>
              <Settings />
              <Head>
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
              </Head>
              <TopProgressBar />
              <Component {...pageProps} />
            </NotistackProvider>
          </RtlLayout>
        </ThemePrimaryColor>
      </ThemeConfig>
    </SettingsProvider>
  );
}
