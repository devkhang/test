import { Icon } from "@iconify/react";
import { ReactNode, useState } from "react";
import searchFill from "@iconify/icons-eva/search-fill";
// material
import { experimentalStyled as styled  } from "@material-ui/core/styles";
import {
  Box,
  Input,
  Slide,
  Button,
  InputAdornment,
  ClickAwayListener,
  alpha
} from "@material-ui/core";
// components
import { MIconButton } from "../../components/@material-extend";
import useLocales from "src/hooks/useLocales";

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled("div")(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 99,
  width: "100%",
  display: "flex",
  position: "absolute",
  alignItems: "center",
  height: APPBAR_MOBILE,
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
  [theme.breakpoints.up("md")]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
  "& > button": {
    width: "105px",
  },
}));
const Head = styled("div")(({ theme }) => ({
  "& > .MuiSelect-root": {
    verticalAlign: "super",
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar({
  component,
  search = {},
}: {
  component?: ReactNode;
  search?: any;
}) {
  const { translate } = useLocales();
  const [isOpen, setOpen] = useState(false);
  const { onSearch, value } = search;
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!isOpen && (
          <Head>
            {!!search.onSearch && (
              <MIconButton onClick={handleOpen}>
                <Icon
                  color={value ? "red" : "#637381"}
                  icon={searchFill}
                  width={24}
                  height={24}
                />
              </MIconButton>
            )}
            {component}
          </Head>
        )}

        <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
          <SearchbarStyle>
            <Input
              autoFocus
              fullWidth
              disableUnderline
              placeholder={translate("common.search") + " ..."}
              startAdornment={
                <InputAdornment position="start">
                  <Box
                    component={Icon}
                    icon={searchFill}
                    sx={{ color: "text.disabled", width: 24, height: 24 }}
                  />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: "fontWeightBold" }}
              {...(search || {})}
            />
            <Button variant="contained" onClick={onSearch}>
              {translate("common.search")}
            </Button>
          </SearchbarStyle>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}
