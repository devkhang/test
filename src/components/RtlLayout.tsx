import { useEffect, ReactNode } from "react";
// rtl
import rtl from "jss-rtl";
import { create } from "jss";
import rtlPlugin from "stylis-plugin-rtl";
// emotion
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
// material
import { StylesProvider, jssPreset, useTheme } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

// ----------------------------------------------------------------------

type RtlLayoutProps = {
  children?: ReactNode;
};

export default function RtlLayout({ children }: RtlLayoutProps) {
  const theme = useTheme<Theme>();

  const jss = create({
    plugins: [...jssPreset().plugins, rtl()],
  });

  useEffect(() => {
    document.dir = theme.direction;
  }, [theme.direction]);

  const cache = createCache({
    key: theme.direction === "rtl" ? "rtl" : "css",
    prepend: true,
    // @ts-ignore
    stylisPlugins: theme.direction === "rtl" ? [rtlPlugin] : [],
  });

  cache.compat = true;

  return (
    <CacheProvider value={cache}>
      <StylesProvider jss={jss}>{children}</StylesProvider>
    </CacheProvider>
  );
}
