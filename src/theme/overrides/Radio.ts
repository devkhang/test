import { Theme } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function Radio(theme: Theme) {
  return {
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1)
        }
      }
    }
  };
}
