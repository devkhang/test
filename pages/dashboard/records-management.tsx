import React, { useEffect, useRef } from "react";
import { Box, Typography, TextField, MenuItem } from "@material-ui/core";

import { useReducer } from "@vna/lib/dist/commons";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import DashboardLayout from "src/layouts/dashboard";

import {
  columns,
  style,
  recordsReducer,
  HeadTab,
  HeadSelect,
} from "logic/recordsManagement";
import DetailRecords from "logic/recordsManagement/detailRecords";
import Confirm from "logic/components/dialogs/Confirm";
import { ShowDetailRecord } from "logic/recordsManagement/components";
import DialogImport from "logic/recordsManagement/components/DialogImport";

const initialState = {
  rows: [],
  categories: [],
  provinces: [],
  districts: [],
  doets: [],
  doet: {},
  row: {},
  valueSearch: {},
  checkAll: false,
  genders: [
    { name: "Nam", id: 0 },
    { name: "Nữ", id: 1 },
  ],
  openKey: { open: 0, showDetail: 0 },
  openKeyImport: { open: 0 },
  anchorEl: {
    roleId: null,
    contractId: null,
  },
  page: {
    pageSize: 10,
    count: 0,
    page: 0,
  },
  confirm: {
    open: false,
  },
  loading: true,
  editHead: {},
  itemHead: {},
  categoryId: null,
  categoryKey: null,
  catValue: null,
  category: {},
};

const RecordsManagement = () => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const ref = useRef(null);

  const [state, dispatch] = useReducer({
    reducer: recordsReducer,
    name: "recordsReducer",
    initialState,
    translate,
    enqueueSnackbar,
    ref,
  });

  const {
    loading,
    rows,
    row,
    doets,
    doet,
    confirm,
    page,
    checkAll,
    genders,
    anchorEl,
    openKey,
    openKeyImport,
    provinces,
    districts,
    valueSearch,
    editHead,
    categoryId,
    categoryKey,
    categories,
    category,
    catValue,
    status,
  } = state;

  useEffect(() => {
    dispatch("initial");
  }, []);

  const classes = style({
    widthTable: categoryKey !== "LS" ? 1856 : 1446,
  });

  return (
    <DashboardLayout
      breadcrumbs={{ url: "records-management", name: "recordsManagement" }}
    >
      <HeadTab
        dispatch={dispatch}
        data={{ categories, category, catValue, doet }}
      />
      <TextField
        select
        title={doet?.name || ""}
        label={translate("common.unit")}
        className={classes.selectDoet}
        value={`${doet?.id === 0 ? 0 : doet?.id || null}`}
        onChange={(e) =>
          dispatch({
            type: "onChange",
            name: "doet",
            value: e.target.value,
          })
        }
      >
        {doets.map((item: any) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
      <HeadSelect dispatch={dispatch} categoryKey={categoryKey} doet={doet} />
      <Box sx={{ padding: "8px" }}>
        <Loading loading={loading} className={classes.loading}>
          <CommonTable
            columns={
              categoryKey === "LS" ? columns.filter((i) => !i.isHide) : columns
            }
            rows={rows}
            data={{
              valueSearch,
              dispatch,
              checkAll,
              editHead,
              anchorEl,
              classes,
              genders,
              districts,
              status,
              doet,
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
      </Box>
      <ShowDetailRecord
        showDetail={openKey?.showDetail}
        row={row}
        categoryKey={categoryKey}
      />
      <DetailRecords
        openKey={openKey?.open}
        categoryKey={categoryKey}
        categoryId={categoryId}
        row={row}
        doet={doet}
        refresh={() => dispatch("onPaging")}
      />
      <DialogImport
        data={{ openKeyImport, categoryId, categoryKey, provinces, doet }}
        deliverImportItem={() => dispatch({ type: "refresh" })}
      />
    </DashboardLayout>
  );
};

export default RecordsManagement;
