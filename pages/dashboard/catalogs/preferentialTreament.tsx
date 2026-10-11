import React, { useEffect } from "react";
import _ from "lodash";
import { Typography, Box, Tabs, Tab } from "@material-ui/core";
import { useSnackbar } from "notistack";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import { useReducer } from "@vna/lib/dist/commons";

import DashboardLayout from "src/layouts/dashboard";
import useLocales from "src/hooks/useLocales";

import { subsidyForms } from "logic/preferentialTreaments/util";
import HeadYear from "logic/components/HeadYear";
import Confirm from "logic/components/dialogs/Confirm";
import {
  preferentialReducer,
  styles,
  columns,
  Dialog,
} from "logic/preferentialTreaments";

const initialState = {
  rows: [],
  oldRows: [],
  row: {},
  categories: [],
  loading: true,
  openKey: { open: 0 },
  confirm: {
    open: false,
  },
  valueTab: 0,
  year: {},
  editHead: {},
  category: {},
};

export default function PreferentialTreament() {
  const classes = styles();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [state, dispatch] = useReducer({
    reducer: preferentialReducer,
    name: preferentialReducer.name,
    initialState,
    orther: { enqueueSnackbar, translate },
  });

  const {
    rows,
    row,
    confirm,
    loading,
    valueTab,
    year,
    openKey,
    categories,
    category,
    oldRows,
    editHead,
  } = state;

  useEffect(() => {
    dispatch("initial");
  }, []);

  return (
    <DashboardLayout
      breadcrumbs={{
        name: "catalogManagement",
        sub: {
          url: "catalogs/preferentialTreament",
          name: "preferentialTreament",
        },
      }}
    >
      <HeadYear
        category={category}
        categories={categories}
        onChangeCategory={(data) =>
          dispatch({ type: "onChangeCategory", data })
        }
        onChangeYear={(data) => dispatch({ type: "onChangeYear", data })}
      />
      <Box className={classes.box}>
        <Tabs value={valueTab}>
          {subsidyForms.map((item: any, index: any) => (
            <Tab
              key={index}
              onClick={(e: any) => dispatch({ type: "onClickTab", item })}
              className={classes.tab}
              label={translate(item.name)}
            />
          ))}
        </Tabs>
      </Box>
      <Loading loading={loading}>
        <CommonTable
          columns={valueTab !== 3 ? columns.filter((i) => !i.isShow) : columns}
          rows={rows}
          classes={classes}
          data={{ translate, valueTab, editHead }}
          event={(type: any, data: any) =>
            (ele: any, ...rest: any[]) => {
              dispatch({ type, data, ele, rest });
            }}
        />
      </Loading>
      <Dialog
        openKey={openKey}
        data={{ categories, row, valueTab, year, oldRows }}
        deliverItem={() => dispatch({ type: "deliverItem" })}
      />
      <Confirm
        open={confirm.open}
        onClose={() => dispatch("closeConfirm")}
        onYes={() => dispatch("delete")}
      >
        <Typography>{confirm.content}</Typography>
      </Confirm>
    </DashboardLayout>
  );
}
