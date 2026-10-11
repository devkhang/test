import { merge } from 'lodash';
import React from 'react';
import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(
  () => import('react-apexcharts'),
  { ssr: false }
)
import { Card, CardHeader, Box, TextField } from '@material-ui/core';
import { BaseOptionChart } from '../../style';


interface Props {
  years: any;
  year: string;
  data: any;
  translate: any;
  dispatch: any;
}

const PeopleReceiveBenefitChart: React.VFC<Props> = ({ years, year, data, translate, dispatch }) => {
  let month: any[] = [];
  let time: any[] = [];
  let keys: any[] = [];
  if (data) {
    month = (Object.values(data) || []).map((i: any) => i.month)
    time = (Object.values(data) || []).map((i: any) => i.time)
    keys = Object.keys(data || {});
  }
  const CHART_DATA = [
    { name: translate("dashboard.monthly"), data: month },
    { name: translate("dashboard.once"), data: time },
  ];

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: keys
    }
  });

  return (
    <Card>
      <CardHeader
        title={translate("dashboard.peopleReceiveBenefit")}
        action={
          <TextField
            select
            fullWidth
            value={year}
            SelectProps={{ native: true }}
            onChange={(e) => {
              dispatch({
                type: "onChangeYear",
                payload: { actionType: "getPeopleReceiveBenefit", value: e.target.value }
              })
            }}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': {
                pl: 1,
                py: 0.5,
                pr: '24px !important',
                typography: 'subtitle2'
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: 0.75,
                bgcolor: 'background.neutral'
              },
              '& .MuiNativeSelect-icon': {
                top: 4,
                right: 0,
                width: 20,
                height: 20
              }
            }}
          >
            {years.map((year) => (
              <option key={year.id} value={year.year}>{year.year}</option>
            ))}
          </TextField>
        }
      />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}

export default PeopleReceiveBenefitChart;
