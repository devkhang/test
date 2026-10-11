import React, { useEffect } from "react";
import { Box, Tabs, Tab } from "@material-ui/core";
import { otherCategoriesReducer } from "logic/otherCategories";
import useLocales from "src/hooks/useLocales";

import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import DashboardLayout from "src/layouts/dashboard";
import { styles, tabItems, columns } from "logic/otherCategories";

const initialState = {
  rows: [],
  loading: false,
  valueTab: 1,
};
export default function OtherCategories() {
  const classes = styles();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [state, dispatch] = useReducer({
    reducer: otherCategoriesReducer,
    name: "otherCategoriesReducer",
    initialState,
    enqueueSnackbar,
    translate,
  });

  const { rows, loading, valueTab } = state;
  useEffect(() => {
    dispatch("onClickTab");
  }, []);

  return (
    <DashboardLayout
      breadcrumbs={{
        name: "catalogManagement",
        sub: { url: "catalogs/otherCategories", name: "otherCategories" },
      }}
    >
      <Box className={classes.box}>
        <Tabs value={valueTab}>
          {tabItems.map((item: any, index: any) => (
            <Tab
              key={index}
              onClick={(e: any) => dispatch({ type: "onClickTab", item })}
              className={classes.tab}
              icon={<span className="material-icons">{item.icon}</span>}
              label={translate(item.name)}
            />
          ))}
        </Tabs>
      </Box>
      {valueTab === 1 && (
        <Loading loading={loading}>
          <CommonTable
            columns={columns}
            rows={rows}
            classes={classes}
            data={{ translate, valueTab }}
            event={(type: any, data: any) =>
              (ele: any, ...rest: any[]) => {
                dispatch({ type, data, ele, rest });
              }}
          />
        </Loading>
      )}
    </DashboardLayout>
  );
}
