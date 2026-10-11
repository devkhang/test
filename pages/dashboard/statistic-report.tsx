import _ from "lodash";
import React, { useEffect } from "react";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";

import { useReducer } from "@vna/lib/dist/commons";
import DashboardLayout from "src/layouts/dashboard";
import { HeadSelect, statisticReportReducer } from "logic/statisticReport";
import { Box } from "@material-ui/core";

const initialState = {
  years: [],
  doets: [],
  year: {},
  doet: {},
  type: {},
  startDate: "",
  endDate: "",
  src: null,
};

const StatisticReport = () => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer({
    name: "statisticReportReducer",
    reducer: statisticReportReducer,
    initialState,
    translate,
    enqueueSnackbar,
  });
  const { years, year, month, doets, doet, type, src, startDate, endDate } = state;

  useEffect(() => {
    dispatch("initial");
  }, []);
  return (
    <DashboardLayout
      breadcrumbs={{
        name: "statisticReport",
        sub: { url: "statistic-report", name: "report" },
      }}
    >
      <HeadSelect
        dispatch={dispatch}
        data={{ years, year, month, doets, doet, type, startDate, endDate }}
      />
      <br />
      <Box style={{ textAlign: "center", height: "100%" }}>
        <iframe src={src} width="95%" height="95%"></iframe>
      </Box>
    </DashboardLayout>
  );
};

export default StatisticReport;
