import React, { useEffect } from "react";
import _ from "lodash";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import { useReducer } from "@vna/lib/dist/commons";
import {
  Card,
  Grid,
  Typography,
  FormControl,
  TextField,
  Switch,
  MenuItem,
  Box,
  Stack,
  Button,
  InputLabel,
  Select,
} from "@material-ui/core";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { useStyles, profileUserReducer } from "logic/user-profile";
import FormDialog from "logic/components/dialogs/FormDialog";
import ImportAvatar from "logic/userManager/components/Dialog/ImportAvatar";
import { gender } from "logic/userManager/util";

const initialState = {
  open: false,
  data: [],
  provinces: [],
  contracts: [],
  districts: [],
  wards: [],
  roles: [],
  file: {},
};

export default function UserProfile(props: any) {
  const classes = useStyles();
  const { openKey, id } = props;
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer({
    reducer: profileUserReducer,
    name: profileUserReducer.name,
    initialState,
    translate,
    enqueueSnackbar,
    props,
  });

  const { open, data, provinces, districts, wards, roles } = state;

  useEffect(() => {
    if (openKey != 0) {
      dispatch("openDialog");
    }
    if (id !== "") {
      dispatch("initial");
    }
  }, [openKey]);

  return (
    <FormDialog
      maxWidth
      open={open}
      onClose={() => dispatch("closeDialog")}
      onYes={() => dispatch("update")}
    >
      <Box className={classes.oveflow}>
        <Card className={classes.clsFirstCard}>
          <div className="clsDiv">{translate("userProfile.personalInfo")}</div>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="stretch"
          >
            <Grid xs={12} sm={2} className="clsGridIM">
              <Box>
                <ImportAvatar
                  accept="image/*"
                  file={data?.avatar || ""}
                  onDrop={(e) => dispatch({ type: "uploadAvatar", file: e })}
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
              </Box>
              <div className="clsDivStatus">
                <span>{translate("common.active")}</span>
                <Switch checked={true} />
              </div>
            </Grid>
            <Grid
              spacing={3}
              xs={12}
              sm={8}
              container
              justifyContent="space-around"
              className="clsGridForm"
            >
              <Grid xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  label={translate("userManager.account")}
                  value={data?.username || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.disabled}
                />
              </Grid>
              <Grid xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  label={translate("userManager.password")}
                  value="12345678"
                  type="password"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.disabled}
                />
              </Grid>
              <Grid xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  label={translate("common.fullName")}
                  value={data?.fullName || ""}
                  fullWidth
                  onChange={(e) => {
                    dispatch({
                      type: "onChange",
                      name: "fullName",
                      value: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid xs={12} sm={5}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack>
                    <DesktopDatePicker
                      label={translate("userProfile.dateOfBirth")}
                      inputFormat="dd/MM/yyyy"
                      value={data?.dateOfBirth || null}
                      onChange={(e: any) => {
                        dispatch({
                          type: "onChange",
                          name: "dateOfBirth",
                          value: e,
                        });
                      }}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          fullWidth
                          helperText={false}
                          className="clsDateTime"
                        />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
              <Grid xs={12} sm={5}>
                <FormControl fullWidth>
                  <InputLabel>{translate("common.gender")}</InputLabel>
                  <Select
                    label={translate("common.gender")}
                    variant="outlined"
                    value={`${data?.gender !== undefined ? data?.gender : ""}`}
                    onChange={(e) => {
                      dispatch({
                        type: "onChange",
                        name: "gender",
                        value: +e.target.value,
                      });
                    }}
                  >
                    {Object.keys(gender).map((key: any) => (
                      <MenuItem key={key} value={key}>
                        {gender[key]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  label={translate("userManager.typeUser")}
                  value={data?.realRole || ""}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  className={classes.disabled}
                />
              </Grid>
              <Grid xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  label={translate("userManager.namePosition")}
                  value={data?.realRole || ""}
                  fullWidth
                  onChange={(e) => {
                    dispatch({
                      type: "onChange",
                      name: "realRole",
                      value: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  label={translate("userProfile.email")}
                  value={data?.email || ""}
                  fullWidth
                  onChange={(e) => {
                    dispatch({
                      type: "onChange",
                      name: "email",
                      value: e.target.value,
                    });
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Card>
        <Card className={classes.clsSeCard}>
          <div className="clsDiv">{translate("common.contactInfo")}</div>
          <Grid
            spacing={3}
            xs={12}
            sm={8}
            container
            justifyContent="space-around"
            className="clsGridForm"
          >
            <Grid xs={12} sm={5}>
              <Autocomplete
                options={provinces}
                getOptionLabel={(option: any) => option?.value || ""}
                onChange={(e, item) =>
                  dispatch({ type: "selectAuto", name: "province", item })
                }
                value={data?.province || {}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={translate("common.city")}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={5}>
              <Autocomplete
                options={districts}
                getOptionLabel={(option: any) => option.value || ""}
                onChange={(e, item) =>
                  dispatch({ type: "selectAuto", name: "district", item })
                }
                value={data?.district || {}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={translate("common.district")}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={5}>
              <Autocomplete
                options={wards}
                getOptionLabel={(option: any) => option.value || ""}
                onChange={(e, item) =>
                  dispatch({ type: "selectAuto", name: "ward", item })
                }
                value={data?.ward || {}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={translate("common.ward")}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={5}>
              <TextField
                variant="outlined"
                label={translate("common.quarter")}
                value={data?.quarter || ""}
                onChange={(e) => {
                  dispatch({
                    type: "onChange",
                    name: "quarter",
                    value: e.target.value,
                  });
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>
      </Box>
    </FormDialog>
  );
}
