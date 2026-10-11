import React, { useEffect } from "react";
import _ from "lodash";
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
  Autocomplete,
} from "@material-ui/core";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

import { useReducer } from "@vna/lib/dist/commons";
import { Loading } from "@vna/lib/dist/components";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";

import formUserReducer from "./formUserReducer";
import ImportAvatar from "../ImportAvatar";
import { gender } from "../../../util";
import { style } from "./style";

const initialState = {
  provinces: [],
  districts: [],
  wards: [],
  roles: [],
  row: {},
  loads: {
    loading: true,
  },
  type: "",
  errors: {
    isError: false,
    isErrorCode: false,
  },
};

export default function FormUser(props: any) {
  const classes = style();
  const { translate } = useLocales();
  const {
    data: { openKey },
    onClose,
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer({
    reducer: formUserReducer,
    name: formUserReducer.name,
    initialState,
    translate,
    enqueueSnackbar,
    props,
  });

  const { row, provinces, districts, wards, roles, loads, type, errors } =
    state;

  useEffect(() => {
    if (!!openKey) {
      dispatch("initial");
    }
  }, [openKey]);

  return (
    <Box>
      <Loading loading={loads.loading}>
        <Box className={classes.oveflow}>
          <Card className={classes.clsFirstCard}>
            <div className="clsDiv">
              {translate("userManager.seflfProfile")}
            </div>
            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="stretch"
            >
              <Grid xs={12} sm={2} className="clsGridIM">
                <Box>
                  <ImportAvatar
                    loadingAvatar={loads.loadingAvatar}
                    accept="image/*"
                    file={row?.avatar || ""}
                    onDrop={(e) =>
                      dispatch({ type: "uploadAvatar", name: "avatar", e })
                    }
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
                    onBlur={(e) => dispatch({ type: "checkUsername", e })}
                    value={row?.username || ""}
                    fullWidth
                    error={errors.isError || errors.isErrorCode}
                    helperText={
                      row.username === "" && errors.isError
                        ? translate("userManager.compulsory")
                        : errors.isErrorCode
                        ? translate("userManager.alreadyUsaer")
                        : ""
                    }
                    disabled={openKey.type === "update"}
                    onChange={(e) => {
                      dispatch({
                        type: "onChange",
                        name: "username",
                        value: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid xs={12} sm={5}>
                  <TextField
                    variant="outlined"
                    label={translate("userManager.password")}
                    value={openKey.type === "update" ? "" : "12345678"}
                    fullWidth
                    disabled={true}
                  />
                </Grid>
                <Grid xs={12} sm={5}>
                  <TextField
                    variant="outlined"
                    label={translate("userManager.fullName")}
                    value={row?.fullName || ""}
                    error={errors.isError}
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
                        label={translate("userManager.dateOfBirth")}
                        inputFormat="dd/MM/yyyy"
                        value={row?.dateOfBirth || null}
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
                      value={`${row.gender === undefined ? "" : row.gender}`}
                      onChange={(e) => {
                        dispatch({
                          type: "onChange",
                          name: "gender",
                          value: e.target.value,
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
                  <FormControl fullWidth>
                    <InputLabel>
                      {translate("userManager.typeUsers")}
                    </InputLabel>
                    <Select
                      variant="outlined"
                      label={translate("userManager.typeUsers")}
                      error={errors.isError}
                      value={`${
                        row.role === undefined ? "" : row.role?.id || row.role
                      }`}
                      onChange={(e) => {
                        dispatch({
                          type: "onChange",
                          name: "role",
                          value: e.target.value,
                        });
                      }}
                    >
                      {roles.map((item: any) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={5}>
                  <TextField
                    variant="outlined"
                    label={translate("userManager.namePosition")}
                    value={row?.realRole || ""}
                    error={errors.isError}
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
                    label="E-mail"
                    value={row?.email || ""}
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
                  value={row?.province || {}}
                  loading
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
                <Loading loading={!!loads.district}>
                  <Autocomplete
                    options={districts}
                    getOptionLabel={(option: any) => option.value || ""}
                    onChange={(e, item) =>
                      dispatch({ type: "selectAuto", name: "district", item })
                    }
                    value={row?.district || {}}
                    loading
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label={translate("common.district")}
                      />
                    )}
                  />
                </Loading>
              </Grid>
              <Grid xs={12} sm={5}>
                <Loading loading={!!loads.ward}>
                  <Autocomplete
                    options={wards}
                    getOptionLabel={(option: any) => option.value || ""}
                    onChange={(e, item) =>
                      dispatch({ type: "selectAuto", name: "ward", item })
                    }
                    value={row?.ward || {}}
                    loading
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label={translate("common.ward")}
                      />
                    )}
                  />
                </Loading>
              </Grid>
              <Grid xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  label={translate("common.quarter")}
                  value={row?.quarter || ""}
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
      </Loading>
      <Stack
        direction="row"
        justifyContent="flex-end"
        className={classes.buttons}
      >
        <Button sx={{ mr: 1.5 }} onClick={onClose}>
          {translate("common.cancel")}
        </Button>
        <Button
          sx={{ color: "white" }}
          variant="contained"
          onClick={() => dispatch(type)}
        >
          {type === "addNew"
            ? translate("common.add")
            : translate("common.save")}
        </Button>
      </Stack>
    </Box>
  );
}
