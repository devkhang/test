import React, { useEffect } from "react";
import {
  TextField,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Stack,
  Box,
} from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import Confirm from "logic/components/dialogs/Confirm";

import { styles } from "logic/implementationList/styles";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import detailInfoReducer from "./detailInfoReducer";
import { columns } from "./columns";
import _ from "lodash";

import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

interface Props {
  listId: string;
  row: any;
  deliverItem: any;
}

const initialState = {
  loading: false,
  rows: [],
  oldRows: [],
  profiles: [],
  listId: null,
  total: 0,
  page: {
    pageSize: 10,
    count: 0,
    page: 0,
  },
  valueSearch: {},
  editHead: {},
  open: false,
};

export function DetailInfo(props: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const classes = styles();

  const [state, dispatch] = useReducer({
    name: "detailInfoReducer",
    reducer: detailInfoReducer,
    enqueueSnackbar,
    translate,
    initialState,
    props,
  });

  useEffect(() => {
    dispatch("initial");
  }, []);

  const { loading, rows, total, valueSearch, editHead, open, date, err } =
    state;

  return (
    <>
      <Box className={classes.total}>
        <Typography>{`${translate(
          "paymentList.total"
        )} :  ${total}`}</Typography>
        <Button
          variant="contained"
          color="success"
          className={classes.button}
          onClick={() => dispatch("openConfirm")}
        >
          {translate("paymentList.browse")}
        </Button>
      </Box>
      <br />
      <Grid container direction="column" alignItems="stretch">
        <Loading loading={loading}>
          <CommonTable
            columns={columns}
            rows={rows}
            data={{
              translate,
              valueSearch,
              dispatch,
              editHead,
              total,
              classes,
            }}
            event={(type: string, data: any) =>
              (ele: any, ...rest: any) => {
                dispatch({ type, data, ele, rest });
              }}
            classes={classes}
          />
        </Loading>
        {/* <FormControlLabel
          label={translate("paymentList.complete")}
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => dispatch({ type: "onCheck", e })}
            />
          }
        />
        <Typography className={classes.grayTxt}>
          {translate("paymentList.note")}
        </Typography> */}
      </Grid>
      <Confirm
        open={open}
        onClose={() => dispatch("closeConfirm")}
        onYes={() => dispatch("browse")}
      >
        <Typography variant="body1" gutterBottom>
          {translate("paymentList.confirmBrowse")}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack>
            <DesktopDatePicker
              label={translate("paymentList.mesBrowse")}
              inputFormat="dd/MM/yyyy"
              value={date || null}
              onChange={(e) => dispatch({ type: "onChangDate", value: e })}
              renderInput={(params) => (
                <TextField {...params} className="clsDate" error={err} />
              )}
            />
          </Stack>
        </LocalizationProvider>
      </Confirm>
    </>
  );
}
