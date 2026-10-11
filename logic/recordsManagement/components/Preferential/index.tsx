import React, { useEffect } from "react";
import _ from "lodash";
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Box,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import { gird, categoryLO, bhytSupport } from "../utils";
import {
  columns,
  styles,
  preferentialReducer,
  Dialog,
  EduDialog,
  UploadMultiFile,
} from "./preferential";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

interface Props {
  profile: string;
  categoryKey: string;
  categoryId: number;
}

const initialState = {
  prefers: [],
  files: [],
  other: {},
  years: [],
  year: {},
  loading: true,
  alreadyOnList: false,
  openKey: {
    open: 0,
    openEdu: 0,
  },
};

export function Preferential(props: Props) {
  const { profile, categoryKey, categoryId } = props;

  const { translate } = useLocales();
  const classes = styles();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer({
    reducer: preferentialReducer,
    name: "preferentialReducer",
    initialState,
    translate,
    enqueueSnackbar,
    props,
  });

  useEffect(() => {
    dispatch("initial");
  }, [profile]);

  const {
    loading,
    years,
    year,
    openKey,
    other,
    prefers,
    files,
    alreadyOnList,
  } = state;

  return (
    <Grid container direction="column" alignItems="stretch">
      <Grid
        sx={{ display: "flex" }}
        item
        xs={6}
        direction="row"
        justifyContent="flex-start"
      >
        <TextField
          label={translate("common.year")}
          select
          className={classes.textfield}
          value={year}
          onChange={(e) => dispatch({ type: "onSelectYear", e })}
        >
          {years.map((item: any, index: number) => (
            <MenuItem key={index} value={item}>
              {item.year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Box className={classes.box}>
        <Typography variant="h6">
          {translate("recordsManagement.otherInformation")}
        </Typography>
      </Box>
      <Grid container spacing={3} direction="row">
        {(categoryLO(categoryKey) || []).map((item: any) =>
          gird({ ...item, translate, other, dispatch, classes })
        )}

        {categoryKey != "LS" && (
          <>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>
                  {translate("recordsManagement.insurance")}
                </InputLabel>
                <Select
                  label={translate("recordsManagement.insurance")}
                  value={`${
                    other?.insurance !== undefined ? other?.insurance : 0
                  }`}
                  onChange={(e) =>
                    dispatch({
                      type: "onChange",
                      name: "insurance",
                      e,
                    })
                  }
                >
                  {Object.keys(bhytSupport).map((key: any) => (
                    <MenuItem key={key} value={key}>
                      {bhytSupport[key]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {other?.insurance === "1" && (
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack sx={{ width: "100%" }}>
                    <DesktopDatePicker
                      label={translate("recordsManagement.dateInsurance")}
                      inputFormat="dd/MM/yyyy"
                      value={other?.dateInsurance || null}
                      onChange={(e: any) => {
                        dispatch({
                          type: "onChange",
                          name: "dateInsurance",
                          e,
                        });
                      }}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          fullWidth
                          className={`${classes.textField}`}
                        />
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
            )}
          </>
        )}
      </Grid>
      <Box className={classes.box}>
        <Typography variant="h6">
          {translate("recordsManagement.preferentialInformation")}
        </Typography>
      </Box>
      <Grid container direction="column" alignItems="stretch">
        <Grid>
          <Button
            className={classes.button}
            onClick={() => dispatch({ type: "openDialog", name: "prefers" })}
          >
            {translate(
              `${
                _.isEmpty(prefers)
                  ? "recordsManagement.addPreferentialTreament"
                  : "recordsManagement.upDatePreferentialTreament"
              }`
            )}
          </Button>
          <Button
            className={classes.button}
            onClick={() => dispatch({ type: "openDialog", name: "edu" })}
          >
            {translate(
              `${
                _.isEmpty(prefers)
                  ? "recordsManagement.addEducationAllowance"
                  : "recordsManagement.updateEducationAllowance"
              }`
            )}
          </Button>
        </Grid>
        <Loading loading={loading}>
          <CommonTable
            columns={columns}
            rows={prefers}
            data={{ translate }}
            event={(type: string, data: any) =>
              (ele: any, ...rest: any) => {
                dispatch({ type, data, ele, rest });
              }}
            classes={classes}
          />
        </Loading>
      </Grid>
      <Box className={classes.box}>
        <Typography variant="h6">
          {translate("recordsManagement.dowFile")}
        </Typography>
      </Box>
      <Grid>
        <UploadMultiFile
          files={files}
          onDownFile={(data) => dispatch({ type: "onDownFile", data })}
          onDrop={(data) => dispatch({ type: "handleDropFile", data })}
          onRemove={(index) => dispatch({ type: "onRemove", index })}
        />
      </Grid>
      <Dialog
        data={{ year, categoryId, categoryKey, prefers, alreadyOnList }}
        openKey={openKey.open}
        deliverItem={(data) => dispatch({ type: "deliverItem", data })}
      />
      <EduDialog
        openKey={openKey.openEdu}
        data={{ year, categoryKey, profile, prefers }}
        deliverItem={(data) => dispatch({ type: "deliverItem", data })}
      />
    </Grid>
  );
}
