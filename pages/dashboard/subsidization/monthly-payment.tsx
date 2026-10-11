import _ from "lodash";
import React, { useEffect } from "react";
import { Typography } from "@material-ui/core";
import { useReducer } from "@vna/lib/dist/commons";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import DashboardLayout from "src/layouts/dashboard";

import {
  columns,
  styles,
  monthlyPaymentReducer,
  DetailMonthlyPayment,
  HeadSelect,
  ShowDetailList,
} from "logic/monthlyPayment";
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
  page: {
    pageSize: 10,
    count: 0,
    page: 0,
  },
  subsidyForm: 1,
  confirm: {
    open: false,
  },
  openKey: { open: 0 },
  checkAll: false,
  valueSearch: {},
  editHead: {},
  anchorEl: {
    districts: null,
    wards: null,
    unit: null,
  },
  showDetail: 0,
  dataRows: [],
  existCode: [],
  category: [],
  detailItem: {},
};

const MonthlyPayment = () => {
  const classes = styles();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer({
    reducer: monthlyPaymentReducer,
    name: "monthlyPaymentReducer",
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
    category,
    existCode,
    doets,
    doet,
    detailItem,
  } = state;

  useEffect(() => {
    dispatch("initial");
  }, []);

  return (
    <DashboardLayout
      breadcrumbs={{
        name: "allowanceManagement",
        sub: { url: "subsidization/monthly-payment", name: "paymentList" },
      }}
    >
      <HeadSelect
        data={{ years, year, subsidyForm, doets, doet, type: "paymentList" }}
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
            districts,
            wards,
            unit,
            doet,
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
      <ShowDetailList data={{ dataRows, showDetail, detailItem, category }} />
      <DetailMonthlyPayment
        openKey={openKey?.open}
        params={{
          row,
          province,
          form: subsidyForm,
          year,
          category,
          existCode,
          doet,
        }}
        refresh={() => dispatch("refresh")}
      />
    </DashboardLayout>
  );
};

export default MonthlyPayment;
