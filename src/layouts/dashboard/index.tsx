import { ReactNode, useState } from "react";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { set, get } from "src/hooks/useLocalStorage";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
}));

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

type DashboardLayoutProps = {
  children?: ReactNode;
  head?: ReactNode;
  search?: any;
  breadcrumbs?: any;
};

export default function DashboardLayout({
  children,
  head,
  search,
  breadcrumbs,
}: DashboardLayoutProps) {
  const open =
    typeof window !== "undefined" ? !(get("isShowMenu") === false) : true;

  const [isShowMenu, setShowOpen] = useState(open);

  const onClick = () => {
    set("isShowMenu", !isShowMenu ? true : false);
    setShowOpen(!isShowMenu);
  };

  const setShow = () => {
    set("isShowMenu", false);
    setShowOpen(false);
  };

  return (
    <RootStyle>
      <DashboardNavbar
        isOpen={isShowMenu}
        onOpenSidebar={onClick}
        head={head}
        search={search}
        breadcrumbs={breadcrumbs}
      />
      <DashboardSidebar isOpenSidebar={isShowMenu} onCloseSidebar={setShow} />

      <MainStyle>{children}</MainStyle>
    </RootStyle>
  );
}
