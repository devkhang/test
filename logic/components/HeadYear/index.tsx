import React, { useEffect } from "react";
import _ from "lodash";
import {
  Grid,
  TextField,
  MenuItem,
  Theme,
  Autocomplete,
} from "@material-ui/core";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import { makeStyles } from "@material-ui/styles";

import useLocales from "src/hooks/useLocales";
import yearReducer from "./headYearReducer";

const styles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    textfield: {
      "& .MuiSelect-filled": {
        padding: "8px 35px",
        backgroundColor: isDark ? "#161C24" : "white",
      },
    },
    select: {
      width: "270px",
      "& .MuiFilledInput-root": {
        padding: "8px 35px",
        backgroundColor: isDark ? "#161C24" : "white",
      },
    },
    categorySelect: {
      "& .MuiFilledInput-root": {
        padding: "8px 35px",
        backgroundColor: isDark ? "#161C24" : "white",
      },
    },
  };
});

const initialState = {
  years: [],
  provinces: [],
  province: {},
  year: {},
};

export default function HeadYear(props: any) {
  const classes = styles();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { categories, category } = props;
  const [state, dispatch] = useReducer({
    reducer: yearReducer,
    name: yearReducer.name,
    initialState,
    props,
    orther: { enqueueSnackbar, translate },
  });

  const { years, year } = state;
  useEffect(() => {
    dispatch("initial");
  }, []);

  return (
    <Grid container justifyContent="space-between" sx={{ padding: "8px" }}>
      <Grid sx={{ display: "flex" }} item xs={12} md={6} direction="row">
        <Autocomplete
          options={categories}
          fullWidth
          getOptionLabel={(option: any) => option?.name || ""}
          onChange={(e, item) => dispatch({ type: "onSelectCategory", item })}
          value={category}
          loading
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              title={category?.name || ""}
              variant="filled"
              className={classes.categorySelect}
            />
          )}
        />
      </Grid>
      <Grid
        sx={{ display: "flex" }}
        item
        direction="row"
        justifyContent="flex-end"
      >
        <TextField
          select
          className={classes.textfield}
          variant="filled"
          value={year}
          onChange={(e) => dispatch({ type: "onSelectYear", e })}
        >
          {years.map((item: any, index: number) => (
            <MenuItem key={index} value={item}>
              {item.year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
}
