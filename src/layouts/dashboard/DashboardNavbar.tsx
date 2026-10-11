import { Icon } from "@iconify/react";
import moreVertical from "@iconify/icons-eva/more-vertical-fill";
// material
import { useTheme } from "@material-ui/styles";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import {
  Theme,
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  alpha,
  Breadcrumbs,
  Link,
} from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
//
import Searchbar from "./Searchbar";
import AccountPopover from "./AccountPopover";
import LanguagePopover from "./LanguagePopover";
import NotificationsPopover from "./NotificationsPopover";
import { ReactNode } from "react";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const MENU_WIDTH = 78;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;
const url = "/dashboard";

const RootStyle = styled(AppBar)(
  ({ theme, full }: { theme: Theme; full: string }) => ({
    boxShadow: "none",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
    backgroundColor: alpha(theme.palette.background.default, 0.72),
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${
        (full === "full" ? DRAWER_WIDTH : MENU_WIDTH) + 1
      }px)`,
    },
  })
);

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up("lg")]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 2),
  },
}));

// ----------------------------------------------------------------------

type DashboardNavbarProps = {
  isOpen: boolean;
  onOpenSidebar: VoidFunction;
  head?: ReactNode;
  search?: any;
  breadcrumbs?: any;
};

export default function DashboardNavbar({
  isOpen,
  onOpenSidebar,
  head,
  search,
  breadcrumbs,
}: DashboardNavbarProps) {
  const theme = useTheme<Theme>();
  const { translate } = useLocales();
  return (
    <RootStyle full={isOpen ? "full" : "menu"} theme={theme}>
      <ToolbarStyle>
        <IconButton
          onClick={onOpenSidebar}
          sx={{
            mr: 2,
            color: "text.primary",
            boxShadow: "0 3px 4px 0 rgb(145 158 171)",
          }}
        >
          <Icon icon={moreVertical} />
        </IconButton>

        {!!breadcrumbs && (
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              underline="hover"
              key="1"
              color="inherit"
              href={
                !!breadcrumbs?.url
                  ? breadcrumbs?.url === "dashboard"
                    ? url
                    : `${url}/${breadcrumbs?.url}`
                  : "/"
              }
            >
              {translate(`breadcrumbs.${breadcrumbs?.name}`) || ""}
            </Link>
            {!!breadcrumbs?.sub && (
              <Link
                underline="hover"
                key="2"
                color="inherit"
                href={`${url}/${breadcrumbs.sub?.url}` || "/"}
              >
                {translate(`breadcrumbs.${breadcrumbs.sub?.name}`) || ""}
              </Link>
            )}
          </Breadcrumbs>
        )}

        <Searchbar component={head} search={search} />
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={{ xs: 0.5, sm: 2 }}>
          <LanguagePopover />
          {/* <NotificationsPopover /> */}
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
