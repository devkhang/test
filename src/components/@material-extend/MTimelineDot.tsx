// material
import { useTheme } from "@material-ui/styles";
import { TimelineDot, TimelineDotProps } from "@material-ui/lab";
import { Theme } from "@material-ui/core"

// ----------------------------------------------------------------------

interface MTimelineDotProps extends Omit<TimelineDotProps, "color"> {
  color?:
    | "grey"
    | "inherit"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error";
}

export default function MTimelineDot({
  color = "grey",
  variant = "filled",
  sx,
  ...other
}: MTimelineDotProps) {
  const theme = useTheme<Theme>();

  if (
    color === "grey" ||
    color === "inherit" ||
    color === "primary" ||
    color === "secondary"
  ) {
    return <TimelineDot color={color} variant={variant} sx={sx} {...other} />;
  }

  return (
    <TimelineDot
      variant={variant}
      sx={{
        ...(variant === "filled" && {
          color: theme.palette[color].contrastText,
          backgroundColor: theme.palette[color].main,
        }),
        ...(variant === "outlined" && {
          borderColor: theme.palette[color].main,
        }),
        ...sx,
      }}
      {...other}
    />
  );
}
