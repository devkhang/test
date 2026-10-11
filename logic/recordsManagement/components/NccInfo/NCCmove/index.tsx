import React from "react";
import {
  Grid,
  TextField,
  FormControlLabel,
  Theme,
  Stack,
  Autocomplete,
  Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import useLocales from "src/hooks/useLocales";
import { UploadFile } from "../../utils";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

const styles = makeStyles((theme: Theme) => ({
  textfield: {
    "& .MuiSelect-filled": {
      padding: "8px 35px",
      backgroundColor: "white",
    },
  },
  select: {
    width: "270px",
    "& .MuiFilledInput-root": {
      padding: "8px 35px",
      backgroundColor: "white",
    },
  },
  upload: {
    width: "50%",
    marginTop: "24px",
  },
}));

export default function NCCmove(props: any) {
  const { data, dispatch } = props;
  const { provinces, districts, wards, move, type } = data;
  const classes = styles();
  const { translate } = useLocales();

  return (
    <>
      <Grid direction="row" spacing={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={type === 0}
              onClick={(e) => dispatch({ type: "NCCmove", name: 0, e })}
            />
          }
          label={translate("recordsManagement.NCCcome")}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={type === 1}
              onClick={(e) => dispatch({ type: "NCCmove", name: 1, e })}
            />
          }
          label={translate("recordsManagement.NCCmove")}
        />
      </Grid>
      <br />
      {(type === 0 || type === 1) && (
        <>
          <Grid container direction="row" spacing={6}>
            <Grid item md={3} xs={6}>
              <TextField
                fullWidth
                label={translate("recordsManagement.decisionNumber")}
                className={classes.textfield}
                value={move?.decided || ""}
                onChange={(e) =>
                  dispatch({ type: "onChangNCCmove", name: "decided", e })
                }
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                fullWidth
                label={translate("recordsManagement.decision")}
                className={classes.textfield}
                value={move?.person || ""}
                onChange={(e) =>
                  dispatch({ type: "onChangNCCmove", name: "person", e })
                }
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                fullWidth
                label={translate("recordsManagement.organDecision")}
                className={classes.textfield}
                value={move?.organ || ""}
                onChange={(e) =>
                  dispatch({ type: "onChangNCCmove", name: "organ", e })
                }
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack>
                  <DesktopDatePicker
                    inputFormat="dd/MM/yyyy"
                    value={move?.date || null}
                    onChange={(e) =>
                      dispatch({ type: "onChangNCCmove", name: "date", e })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="clsDate"
                        helperText={false}
                        label={translate(
                          `${
                            type === 0
                              ? "recordsManagement.moveInDate"
                              : "recordsManagement.transferDate"
                          }`
                        )}
                      />
                    )}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid item md={3} xs={6}>
              <TextField
                fullWidth
                label={translate(
                  `${
                    type === 0
                      ? "recordsManagement.addressBefore"
                      : "recordsManagement.addressMove"
                  }`
                )}
                value={type === 0 ? move?.moveIn || "" : move?.transfer || ""}
                onChange={(e) =>
                  dispatch({
                    type: "onChangNCCmove",
                    name: type === 0 ? "moveIn" : "transfer",
                    e,
                  })
                }
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <Autocomplete
                options={provinces || []}
                getOptionLabel={(option: any) => option?.value || ""}
                onChange={(e, item) =>
                  dispatch({
                    type: "selectAuto",
                    name: "province",
                    item,
                  })
                }
                value={move?.province || {}}
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
            <Grid item md={3} xs={6}>
              <Autocomplete
                options={districts || []}
                getOptionLabel={(option: any) => option?.value || ""}
                onChange={(e, item) =>
                  dispatch({
                    type: "selectAuto",
                    name: "district",
                    item,
                  })
                }
                value={move?.district || {}}
                loading
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={translate("common.district")}
                  />
                )}
              />
            </Grid>
            <Grid item md={3} xs={6}>
              <Autocomplete
                options={wards || []}
                getOptionLabel={(option: any) => option?.value || ""}
                onChange={(e, item) =>
                  dispatch({
                    type: "selectAuto",
                    name: "ward",
                    item,
                  })
                }
                value={move?.ward || {}}
                loading
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={translate("common.ward")}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid className={classes.upload}>
            <UploadFile
              {...{ files: move?.file || [], name: "file", dispatch }}
            />
          </Grid>
        </>
      )}
    </>
  );
}
