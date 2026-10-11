import { merge } from "lodash";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import { Card, CardHeader, Box, TextField } from "@material-ui/core";
import dynamic from "next/dynamic";
import React from "react";
import { BaseOptionChart } from "../../style";

interface Props {
  years: any;
  year: string;
  data: number;
  translate: any;
  dispatch: any;
}

const MonthlyAllowanceCostChart: React.VFC<Props> = ({
  years,
  year,
  data,
  translate,
  dispatch,
}) => {
  const CHART_DATA: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: translate("dashboard.expense"),
      type: "column",
      data: Object.values(data || {}) || [],
    },
    {
      name: "",
      type: "area",
      data: Object.values(data || {}) || [],
    },
  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: 0 },
    plotOptions: { bar: { columnWidth: "11%", borderRadius: 4 } },
    fill: { type: ["solid", "gradient", "solid"] },
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => {
          if (value) {
            return value.toLocaleString();
          }
          return value;
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          if (value) {
            return value.toLocaleString();
          }
          return value;
        },
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title={translate("dashboard.monthlyAllowanceCost")}
        action={
          <TextField
            select
            fullWidth
            value={year}
            SelectProps={{ native: true }}
            onChange={(e) => {
              dispatch({
                type: "onChangeYear",
                payload: {
                  actionType: "getMonthlyAllowanceCost",
                  value: e.target.value,
                },
              });
            }}
            sx={{
              "& fieldset": { border: "0 !important" },
              "& select": {
                pl: 1,
                py: 0.5,
                pr: "24px !important",
                typography: "subtitle2",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: 0.75,
                bgcolor: "background.neutral",
              },
              "& .MuiNativeSelect-icon": {
                top: 4,
                right: 0,
                width: 20,
                height: 20,
              },
            }}
          >
            {years.map((year) => (
              <option key={year.id} value={year.year}>
                {year.year}
              </option>
            ))}
          </TextField>
        }
      />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          series={CHART_DATA}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
};

export default MonthlyAllowanceCostChart;
