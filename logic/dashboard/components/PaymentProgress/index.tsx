import React from 'react';
import { Grid, Card, CardHeader, TextField, LinearProgress, Box } from '@material-ui/core';
import { ProgressHeader } from "./style";

interface Props {
  years: any;
  year: string;
  data: any;
  translate: any;
  dispatch: any;
}

const PaymentProgress:React.VFC<Props> = ({ years, year, data, translate, dispatch }) => {
  return (
    <Grid marginY={4}>
      <Card>
        <CardHeader
          title={translate("dashboard.paymentProgress")}
          action={
            <TextField
              select
              fullWidth
              value={year}
              SelectProps={{ native: true }}
              onChange={(e) => {
                dispatch({
                  type: "onChangeYear",
                  payload: { actionType: "getPaymentProgress", value: e.target.value }
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
              { years.map((year) => (
                <option key={year.id} value={year.year}>{year.year}</option>
              )) }
            </TextField>
          }
        />

        <Box sx={{ px: 3, py: 0 }} dir="ltr">
          { data.map((process, index) => {
            const percent = (process.excute / process.paid) * 100;
            return (
              <Box marginY={4} key={index}>
                <ProgressHeader>
                  <div>{process.province[0].name}</div>
                  <div>VNĐ {process.paid ? process.paid.toLocaleString() : 0} {`(${percent.toFixed(1)}%)`}</div>
                </ProgressHeader>
                <LinearProgress variant="determinate" color="secondary" value={percent} />
              </Box>
            )
          }) }
        </Box>
      </Card>
    </Grid>
  );
};

export default PaymentProgress;
