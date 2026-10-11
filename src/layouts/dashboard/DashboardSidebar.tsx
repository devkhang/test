import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useTheme } from "@material-ui/styles";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { Theme, Avatar, Box, Drawer, Typography } from "@material-ui/core";
import { MHidden } from "../../components/@material-extend";
import { useReducer } from "@vna/lib/dist/commons";

import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import {
  leftSidebarReducer,
  Scrollbar,
  NavSection,
  UserProfile,
} from "logic/leftSidebar";
import sidebarConfig from "./SidebarConfig";
import background from "public/favicon/Logo_NCC.svg";
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const MENU_WIDTH = 78;
const avatar_default = "public/static/mock-images/avatars/avatar_default.jpg";
const logoImg = "/favicon/logoLD.png";

const RootStyle = styled("div")(
  ({ theme, full }: { theme: Theme; full: string }) => ({
    [theme.breakpoints.up("lg")]: {
      flexShrink: 0,
      transition: "0.3s",
      width: full === "full" ? DRAWER_WIDTH : MENU_WIDTH,
    },
  })
);

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "16px 9px",
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[500_12],
  "& .MuiAvatar-root": {
    width: 44,
    height: 44,
  },
}));

// ----------------------------------------------------------------------

type DashboardSidebarProps = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
};

const initialState = {
  open: 0,
  user: {
    avatar: avatar_default,
    fullName: "",
    realRole: "",
    id: "",
  },
  header: {
    logo: logoImg,
    name: "",
    province: "",
  },
};

export default function DashboardSidebar({
  isOpenSidebar,
  onCloseSidebar,
}: DashboardSidebarProps) {
  const theme = useTheme<Theme>();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(0);

  const [state, dispatch] = useReducer({
    reducer: leftSidebarReducer,
    name: "leftSidebarReducer",
    initialState,
    translate,
    enqueueSnackbar,
  });

  const openDialog = () => {
    setOpen(open + 1);
  };

  useEffect(() => {
    dispatch("initial");
  }, []);

  const { user, header } = state;

  const fullMenu = (
    <Scrollbar
      sx={{
        backgroundImage: `url(${background.src})`,
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 1.5, py: 4 }}>
        <NextLink href="/dashboard">
          <Box sx={{ display: "inline-flex" }}>
            <Avatar
              alt="logo"
              src={header?.logo || logoImg}
              sx={{ width: 55, height: 55, borderRadius: 50 }}
            />
            <Box
              sx={{
                m: "auto",
                pl: 2,
                textAlign: "center",
                whiteSpace: "nowrap",
                color: "white",
                display: !isOpenSidebar ? "none" : "block",
              }}
            >
              <h4>{header?.name || "Sở LĐTBXH"}</h4>
              <h4>{header?.province || "Đắk Nông"}</h4>
            </Box>
          </Box>
        </NextLink>
      </Box>

      <Box sx={{ mx: 1, mb: 4, cursor: "pointer" }}>
        <NextLink href="">
          <AccountStyle onClick={openDialog}>
            <Avatar alt="My Avatar" src={user?.avatar || avatar_default} />
            <Box
              sx={{
                ml: 2,
                whiteSpace: "nowrap",
                color: "white",
                display: !isOpenSidebar ? "none" : "",
              }}
            >
              <Typography variant="subtitle2">
                {user?.fullName || ""}
              </Typography>
              <Typography variant="body2">{user?.realRole || ""}</Typography>
            </Box>
          </AccountStyle>
        </NextLink>
      </Box>

      <UserProfile openKey={open} id={user?.id || ""} />
      <NavSection short={!isOpenSidebar} navConfig={sidebarConfig()} />
    </Scrollbar>
  );

  return (
    <RootStyle full={isOpenSidebar ? "full" : "menu"} theme={theme}>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              transition: "0.3s",
              overflowX: "hidden",
            },
          }}
          SlideProps={{
            easing: {
              enter: theme.transitions.easing.easeOut,
              exit: theme.transitions.easing.sharp,
            },
          }}
        >
          {fullMenu}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          SlideProps={{
            easing: {
              enter: theme.transitions.easing.easeOut,
              exit: theme.transitions.easing.sharp,
            },
          }}
          PaperProps={{
            sx: {
              width: !isOpenSidebar ? MENU_WIDTH : DRAWER_WIDTH,
              bgcolor: "background.default",
              transition: "0.3s",
              overflowX: "hidden",
            },
          }}
        >
          {fullMenu}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
