import _ from "lodash";
import React, { useEffect } from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { useReducer } from "@vna/lib/dist/commons";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import DashboardLayout from "src/layouts/dashboard";

import {
  columns,
  styles,
  implementationListReducer,
  DetailImplementationList,
  ShowExecuteList,
} from "logic/implementationList";
import { HeadSelect } from "logic/monthlyPayment";
import Confirm from "logic/components/dialogs/Confirm";

const initialState = {
  loading: true,
  rows: [],
  row: {},
  years: [],
  year: {},
  doets: [],
  doet: {},
  provinces: [],
  province: {},
  districts: [],
  wards: [],
  unit: [],
  confirm: {
    open: false,
  },
  openKey: { open: 0 },
  page: {
    pageSize: 10,
    count: 0,
    page: 0,
  },
  checkAll: false,
  valueSearch: {},
  editHead: {},
  anchorEl: {
    districts: null,
    wards: null,
    unit: null,
  },
  subsidyForm: 1,
  showDetail: 0,
  dataRows: [],
  existCode: [],
  total: 0,
  roleUser: "",
};

const ImplementationList = () => {
  const classes = styles();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer({
    reducer: implementationListReducer,
    name: "implementationListReducer",
    initialState,
    translate,
    enqueueSnackbar,
  });

  const {
    subsidyForm,
    rows,
    row,
    openKey,
    confirm,
    loading,
    page,
    checkAll,
    anchorEl,
    districts,
    wards,
    unit,
    valueSearch,
    editHead,
    province,
    years,
    year,
    showDetail,
    dataRows,
    total,
    receiveDate,
    existCode,
    doets,
    doet,
    roleUser,
  } = state;

  useEffect(() => {
    dispatch("initial");
  }, []);

  return (
    <DashboardLayout
      breadcrumbs={{
        name: "allowanceManagement",
        sub: {
          url: "subsidization/implementation-list",
          name: "implementationList",
        },
      }}
    >
      <HeadSelect
        data={{ years, year, subsidyForm, doets, doet }}
        dispatch={dispatch}
      />

      <Loading loading={loading} className={classes.loading}>
        <CommonTable
          columns={columns}
          rows={rows}
          data={{
            checkAll,
            valueSearch,
            editHead,
            anchorEl,
            classes,
            districts,
            wards,
            unit,
            doet,
            roleUser,
            dispatch,
            translate,
          }}
          page={{
            ...page,
            onChange: (event: any, pageNumber: any, pageSize: any) => {
              dispatch({
                type: "onPaging",
                pageNumber,
                pageSize,
              });
            },
          }}
          event={(type: string, data: any) =>
            (ele: any, ...rest: any) => {
              dispatch({ type, data, ele, rest });
            }}
          classes={classes}
        />
      </Loading>
      <Confirm
        open={confirm.open}
        onClose={() => dispatch("closeConfirm")}
        onYes={() => dispatch(confirm.type)}
      >
        <Typography variant="h6" gutterBottom>
          {confirm.content}
        </Typography>
      </Confirm>
      <ShowExecuteList data={{ dataRows, total, receiveDate, showDetail }} />
      {!!row && (
        <DetailImplementationList
          openKey={openKey?.open}
          params={{
            row,
            province,
            form: subsidyForm,
            yearId: year.id,
            existCode,
            doet,
          }}
          refresh={() => dispatch("refresh")}
        />
      )}
    </DashboardLayout>
  );
};

export default ImplementationList;
