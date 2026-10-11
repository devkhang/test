import { Theme } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function Container(theme: Theme) {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {}
      }
    }
  };
}
