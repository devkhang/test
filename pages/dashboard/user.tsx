import React, { useEffect } from "react";
import _ from "lodash";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import { useReducer } from "@vna/lib/dist/commons";
import { Typography, Box } from "@material-ui/core";

import DashboardLayout from "src/layouts/dashboard";
import Confirm from "logic/components/dialogs/Confirm";
import {
  style,
  HeadSelect,
  userManagementReducer,
  Dialog,
  columns,
} from "logic/userManager";

const initialState = {
  rows: [],
  row: {},
  unitId: null,
  dataFilter: {},
  valueSearch: {},
  roles: [],
  genders: [
    { name: "Nam", id: 0 },
    { name: "Nữ", id: 1 },
  ],
  openKey: { open: 0 },
  anchorEl: {
    roleId: null,
    contractId: null,
  },
  page: {
    pageSize: 5,
    count: 0,
    page: 0,
  },
  valueFilter: {},
  editHead: {},
  confirm: {
    open: false,
  },
  loading: true,
};

export default function UserManagement() {
  const classes = style();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer({
    reducer: userManagementReducer,
    name: userManagementReducer.name,
    initialState,
    translate,
    enqueueSnackbar,
  });

  const {
    rows,
    row,
    confirm,
    loading,
    page,
    checkAll,
    roles,
    genders,
    anchorEl,
    openKey,
    valueSearch,
    unitId,
    editHead,
    dataDoet,
  } = state;

  useEffect(() => {
    dispatch("initial");
  }, []);

  return (
    <DashboardLayout breadcrumbs={{ url: "user", name: "user" }}>
      <HeadSelect
        deliverItem={(data: any) => dispatch({ type: "onSelect", data })}
        deliverSearchItem={(data: any) => dispatch({ type: data.name, data })}
        deliverImpoItem={(data: any) => dispatch({ type: "openDialog", data })}
      />
      <Box>
        <Loading loading={loading} className={classes.loading}>
          <CommonTable
            columns={columns}
            rows={rows}
            data={{
              valueSearch,
              dispatch,
              checkAll,
              roles,
              anchorEl,
              classes,
              genders,
              editHead,
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
          <Typography>{confirm.content}</Typography>
        </Confirm>
      </Box>
      <Dialog
        data={{ roles, openKey, row, unitId, dataDoet }}
        deliverImportItem={(data: any) =>
          dispatch({ type: "deliverImport", data })
        }
        deliverItem={(data: any) => dispatch({ type: "onClickForm", data })}
      />
    </DashboardLayout>
  );
}
