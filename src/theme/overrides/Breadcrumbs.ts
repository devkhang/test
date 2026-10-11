import { Theme } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function Breadcrumbs(theme: Theme) {
  return {
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          marginLeft: theme.spacing(2),
          marginRight: theme.spacing(2)
        }
      }
    }
  };
}
