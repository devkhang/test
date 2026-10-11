import React, { useEffect } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";

import { styles } from "logic/monthlyPayment/styles";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import detailedListReducer from "./detailedListReducer";
import { columns } from "./columns";
import { Dialog } from "./Dialog";
import _ from "lodash";

const initialState = {
  loading: true,
  show: false,
  rows: [],
  oldRows: [],
  typeCategory: {},
  prefers: [],
  oldPrefers: [],
  rowsChecked: [],
  checkAll: false,
  total: 0,
  page: {
    pageSize: null,
    count: 0,
    page: 0,
  },
  valueSearch: {},
  editHead: { rows: {}, prefers: {} },
  genders: [
    { name: "Nam", id: 0 },
    { name: "Nữ", id: 1 },
  ],
  anchorEl: {
    genders: null,
  },
};

export function DetailedList(props: any) {
  const { listId, province, district, ward, category, code } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const classes = styles();

  const [state, dispatch] = useReducer({
    name: "detailedListReducer",
    reducer: detailedListReducer,
    enqueueSnackbar,
    translate,
    initialState,
    props,
  });

  useEffect(() => {
    dispatch("initial");
  }, [listId]);

  const {
    loading,
    rows,
    show,
    typeCategory,
    prefers,
    checkAll,
    page,
    total,
    valueSearch,
    editHead,
    genders,
    anchorEl,
  } = state;

  return (
    <Grid container direction="column" alignItems="stretch">
      <Button
        variant="contained"
        color="success"
        className={classes.btn}
        onClick={() => dispatch("showModal")}
      >
        {!_.isEmpty(rows)
          ? translate("common.update")
          : translate("common.add")}
      </Button>
      <Loading loading={loading}>
        <CommonTable
          columns={columns.filter((i) => !i.isHide)}
          rows={rows}
          data={{
            renderRows: "rows",
            translate,
            valueSearch,
            dispatch,
            checkAll,
            editHead,
            anchorEl,
            genders,
            classes,
          }}
          event={(type: string, data: any) =>
            (ele: any, ...rest: any) => {
              dispatch({ type, data, ele, rest });
            }}
          classes={classes}
        />
      </Loading>
      {!!show && (
        <Dialog
          address={{ province, district, ward }}
          data={{
            dispatch,
            prefers: prefers.filter(
              (i) => !Object.keys(i).includes("isFather")
            ),
            code,
            category,
            typeCategory,
            page,
            show,
            loading,
            editHead,
            anchorEl,
            genders,
            valueSearch,
            checkAll,
          }}
        />
      )}
      <Typography>{`${translate(
        "paymentList.total"
      )} :   ${total}`}</Typography>
    </Grid>
  );
}
