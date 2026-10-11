import _ from "lodash";
import React from "react";
import { Box, TextField, MenuItem, Select } from "@material-ui/core";

import useLocales from "src/hooks/useLocales";
import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const styles = makeStyles((theme: Theme) => {
  return {
    headActions: {
      display: "flex",
      justifyContent: "space-between",
    },
    yearSelect: {
      width: "170px",
      margin: "8px 0",
    },
    selectDoet: {
      width: "45%",
      margin: "8px",
    },
  };
});

const HeadSelect = (props) => {
  const { dispatch, doets, doet, years, year } = props;
  const classes = styles();
  const { translate } = useLocales();

  return (
    <Box className={classes.headActions}>
      <TextField
        select
        title={doet?.name || ""}
        label={translate("common.unit")}
        className={classes.selectDoet}
        value={`${doet?.id === 0 ? 0 : doet?.id || null}`}
        onChange={(e) =>
          dispatch({
            type: "handleChange",
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
      <Select
        className={classes.yearSelect}
        label={translate("common.year")}
        value={year}
        onChange={(e) => {
          dispatch({
            type: "handleChange",
            name: "year",
            value: e.target.value,
          });
        }}
      >
        {years.map((item: any, index: number) => (
          <MenuItem key={index} value={item}>
            {item.year}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default HeadSelect;
