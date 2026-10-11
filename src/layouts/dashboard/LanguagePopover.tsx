import { useRef, useState } from "react";
import { Box, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
// components
import MenuPopover from "../../components/MenuPopover";
import { MIconButton } from "../../components/@material-extend";

export default function LanguagePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { allLang, currentLang, onChangeLang } = useLocales();

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={() => setOpen(true)}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && { bgcolor: "action.selected" }),
        }}
      >
        <img
          src={currentLang.icon}
          alt={currentLang.label}
          style={{ borderRadius: "3px" }}
        />
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
      >
        <Box sx={{ py: 1 }}>
          {allLang.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang.value}
              onClick={() => {
                setOpen(false);
                onChangeLang(option.value);
              }}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box
                  component="img"
                  alt={option.label}
                  src={option.icon}
                  sx={{ height: 40, borderRadius: "5px" }}
                />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: "body2" }}>
                {option.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>
    </>
  );
}
