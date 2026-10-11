import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import faceMan from "@iconify/icons-mdi/face-man";
import keyVariant from "@iconify/icons-mdi/key-variant";
import { useRouter } from "next/router";
import useLocales from "src/hooks/useLocales";
import {
  Box,
  Avatar,
  Button,
  Divider,
  MenuItem,
  Typography,
  alpha,
  Theme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// components
import MenuPopover from "../../components/MenuPopover";
import { MIconButton } from "../../components/@material-extend";
import Auth from "api/Auth";
import ChangePassword from "./ChangePassword";
import UserProfile from "./user-profile";
import { get } from "src/hooks/useLocalStorage";
// ----------------------------------------------------------------------

const useStyles = makeStyles((theme: Theme) => {
  return {
    button: {
      color: "#fff",
      backgroundColor: theme.palette.primary.main,
    },
    avt: {
      borderRadius: "50%",
    },
  };
});

const avatar_default = "public/static/mock-images/avatars/avatar_default.jpg";

export default function AccountPopover() {
  const classes = useStyles();
  const { translate } = useLocales();
  const anchorRef = useRef(null);
  const [item, setItem] = useState({
    avatar: avatar_default,
    fullName: "",
    userName: "",
    id: "",
  });

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [openCPKey, setOpenCPKey] = useState(0);
  const openCPDialog = () => {
    handleClose();
    setOpenCPKey(openCPKey + 1);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    Auth.logOut(router);
  };

  const [openUPKey, setOpenUPKey] = useState(0);
  const openUPDialog = () => {
    handleClose();
    setOpenUPKey(openUPKey + 1);
  };

  useEffect(() => {
    const value = get("user");
    const avt = get("avatar");
    if (value !== null) {
      const avatar = avt || avatar_default;
      const fullName = value?.fullName || "";
      const userName = value?.username || "";
      const id = value?.id || "";
      setItem({
        avatar,
        fullName,
        userName,
        id,
      });
    }
  }, []);

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar alt="My Avatar" src={item.avatar} className={classes.avt} />
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 200 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {item.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {item.userName}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box>
          <MenuItem
            onClick={openUPDialog}
            sx={{ typography: "body2", py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={faceMan}
              sx={{
                mr: 2,
                width: 24,
                height: 24,
              }}
            />
            {translate("changePassword.profile")}
          </MenuItem>
        </Box>
        <Box>
          <MenuItem
            onClick={openCPDialog}
            sx={{ typography: "body2", py: 1, px: 2.5 }}
          >
            <Box
              component={Icon}
              icon={keyVariant}
              sx={{
                mr: 2,
                width: 24,
                height: 24,
              }}
            />
            {translate("changePassword.changePassword")}
          </MenuItem>
        </Box>
        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            className={classes.button}
            onClick={handleLogout}
            fullWidth
            color="inherit"
            variant="outlined"
          >
            {translate("changePassword.logOut")}
          </Button>
        </Box>
      </MenuPopover>
      <UserProfile openKey={openUPKey} id={item.id} />
      <ChangePassword openKey={openCPKey} />
    </>
  );
}
