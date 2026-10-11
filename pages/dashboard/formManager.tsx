import React, { useEffect } from "react";
import _ from "lodash";
import { Typography, Box } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import { useReducer } from "@vna/lib/dist/commons";

import DashboardLayout from "src/layouts/dashboard";
import useLocales from "src/hooks/useLocales";
import { get } from "src/hooks/useLocalStorage";

import Confirm from "logic/components/dialogs/Confirm";
import { formManagerReducer, styles, columns, Header } from "logic/formManager";

const initialState = {
  rows: [],
  row: {},
  years: [],
  year: {},
  loading: true,
  confirm: {
    open: false,
  },
  anchorEl: {
    type: null,
  },
  workUnit: "",
};

export default function PreferentialTreament() {
  const classes = styles();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const user: any = get("user");
  const newColumns = columns.filter((item) =>
    user?.workUnit === "Moet-superAdmin" ? !item?.isHideMoet : !item?.isHide
  );

  const [state, dispatch] = useReducer({
    reducer: formManagerReducer,
    name: "formManagerReducer",
    initialState,
    orther: { enqueueSnackbar, translate },
  });

  const {
    rows,
    confirm,
    loading,
    year,
    years,
    checkAll,
    anchorEl,
    typeFilter,
    showInput,
    workUnit,
  } = state;

  useEffect(() => {
    dispatch("initial");
  }, []);

  return (
    <DashboardLayout breadcrumbs={{ url: "formManager", name: "formManager" }}>
      <Header {...{ workUnit, years, year, showInput, dispatch }} />
      <Box className={classes.box}>
        <Loading loading={loading}>
          <CommonTable
            columns={newColumns}
            rows={rows}
            classes={classes}
            data={{ translate, checkAll, anchorEl, typeFilter, workUnit }}
            event={(type: any, data: any) =>
              (ele: any, ...rest: any[]) => {
                dispatch({ type, data, ele, rest });
              }}
          />
        </Loading>
      </Box>
      <Confirm
        open={confirm.open}
        onClose={() => dispatch("closeConfirm")}
        onYes={() => dispatch(`${confirm.type}`)}
      >
        <Typography>{confirm.content}</Typography>
      </Confirm>
    </DashboardLayout>
  );
}
