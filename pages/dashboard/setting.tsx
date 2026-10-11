import React, { useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Paper,
  Box,
  Autocomplete,
  Button,
} from "@material-ui/core";
import useLocales from "src/hooks/useLocales";

import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import DashboardLayout from "src/layouts/dashboard";
import ImportAvatar from "logic/userManager/components/Dialog/ImportAvatar";
import { settingReducer, styles } from "logic/setting";

const initialState = {
  data: {},
  provinces: [],
  loading: false,
};
export default function Setting() {
  const classes = styles();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [state, dispatch] = useReducer({
    reducer: settingReducer,
    name: "settingReducer",
    initialState,
    enqueueSnackbar,
    translate,
  });

  const { data, provinces, loading } = state;
  useEffect(() => {
    dispatch("initial");
  }, []);

  return (
    <DashboardLayout breadcrumbs={{ url: "setting", name: "setting" }}>
      <Typography variant="h4" gutterBottom component="div">
        {translate("userProfile.setting")}
      </Typography>
      <Paper elevation={3} className={classes.paper}>
        <Grid container spacing={7}>
          <Grid item xs={8} direction="column" className={classes.container}>
            <TextField
              fullWidth
              className={classes.field}
              label={translate("departmentManagement.unitName")}
              value={data?.name || ""}
              onChange={(e) =>
                dispatch({
                  type: "onChange",
                  name: "name",
                  value: e.target.value,
                })
              }
            />
            <Autocomplete
              fullWidth
              options={provinces}
              getOptionLabel={(option: any) => option?.value || ""}
              onChange={(e, item) =>
                dispatch({
                  type: "onChange",
                  name: "province",
                  value: item,
                })
              }
              value={data?.province || {}}
              loading
              renderInput={(params) => (
                <TextField {...params} label={translate("common.city")} />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Box className={classes.gridIM}>
              <ImportAvatar
                loadingAvatar={loading}
                accept="image/*"
                file={data?.logo || ""}
                onDrop={(e) => dispatch({ type: "uploadImg", name: "logo", e })}
                caption={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    {translate("userManager.avatar")}
                  </Typography>
                }
              />
              <Typography className={classes.text}>LOGO</Typography>
            </Box>
            <Box className={classes.button}>
              <Button
                variant="contained"
                className={classes.btn}
                onClick={() => dispatch("save")}
              >
                {translate("common.btnSave")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </DashboardLayout>
  );
}
