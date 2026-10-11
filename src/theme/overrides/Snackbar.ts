import { Theme } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function Snackbar(theme: Theme) {
  return {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {}
      }
    }
  };
}
