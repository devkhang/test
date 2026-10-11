import React, { useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import DashboardLayout from "src/layouts/dashboard";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import {
  columns,
  style,
  burialFeeReducer,
  HeaderActions,
  DetailRecords,
  ShowDetail,
} from "logic/burialFee";
import { useReducer } from "@vna/lib/dist/commons";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import Confirm from "logic/components/dialogs/Confirm";
import { get } from "src/hooks/useLocalStorage";
import { relation } from "logic/recordsManagement/components/utils";
import HeadSelect from "logic/burialFee/components/HeadSelect";

const infoDomain = get("infoDomain");

const initialState = {
  doets: [],
  doet: {},
  categories: [],
  rows: [],
  row: {},
  years: [],
  year: {},
  confirm: {
    open: false,
  },
  modal: {
    open: false,
    openDetail: false,
  },
  loading: true,
  page: {
    pageSize: 10,
    count: 0,
    page: 0,
  },
  checkAll: false,
  valueSearch: {},
  editHead: {},
  anchorEl: {
    roleId: null,
    contractId: null,
  },
};

const BurialFee = () => {
  const classes = style();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer({
    reducer: burialFeeReducer,
    name: burialFeeReducer.name,
    initialState,
    translate,
    enqueueSnackbar,
  });
  const {
    doets,
    doet,
    rows,
    years,
    year,
    loading,
    confirm,
    modal,
    row,
    categories,
    checkAll,
    valueSearch,
    editHead,
    anchorEl,
    page,
  } = state;

  useEffect(() => {
    dispatch("initial");
  }, []);

  return (
    <DashboardLayout
      breadcrumbs={{
        name: "allowanceManagement",
        sub: { url: "subsidization/burial-fee", name: "burialFee" },
      }}
    >
      <HeadSelect {...{ dispatch, doets, doet, years, year }} />
      <HeaderActions {...{ dispatch, translate, doet }} />
      <Box>
        <Loading loading={loading} className={classes.loading}>
          <CommonTable
            columns={columns}
            rows={rows}
            data={{
              translate,
              dispatch,
              categories,
              checkAll,
              valueSearch,
              editHead,
              anchorEl,
              relation,
            }}
            page={{
              ...page,
              onChange: (event, pageNumber, pageSize) => {
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
      </Box>

      <Confirm
        open={confirm.open}
        onClose={() => dispatch("closeConfirm")}
        onYes={() => dispatch(confirm.type)}
      >
        <Typography>
          {translate("preferentialTreament.contentDelete")}
        </Typography>
      </Confirm>

      <DetailRecords
        open={modal.open}
        params={{
          year,
          categories,
          provinceId: infoDomain?.province?.key,
          row,
          doet,
        }}
        deliverItem={() => dispatch({ type: "deliverItem" })}
        onClose={() => dispatch("closeModal")}
      />

      <ShowDetail
        open={modal.openDetail}
        row={row}
        onClose={() => {
          dispatch("closeDetail");
        }}
      />
    </DashboardLayout>
  );
};

export default BurialFee;
