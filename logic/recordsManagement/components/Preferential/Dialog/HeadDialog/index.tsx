import React from "react";
import { Grid, TextField, MenuItem, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import { subsidyForms, beneficiaries } from "../../../utils";

const styles = makeStyles((theme: Theme) => ({
  textfield: {
    "& .MuiSelect-filled": {
      padding: "8px 35px",
      backgroundColor: "white",
    },
  },
  select: {
    width: "270px",
    "& .MuiFilledInput-root": {
      padding: "8px 35px",
      backgroundColor: "white",
    },
  },
}));

export default function HeadDialog(props: any) {
  const { data, dispatch } = props;
  const { year, beneficiary, subsidyForm, categories, category } = data;
  const classes = styles();
  const { translate } = useLocales();
  return (
    <Grid container direction="row" sx={{ margin: "8px 0" }}>
      <Grid container xs={8} spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label={translate("paymentList.category")}
            select
            className={classes.textfield}
            value={category}
            onChange={(e) =>
              dispatch({
                type: "onSelect",
                name: "category",
                value: e.target.value,
              })
            }
          >
            {categories.map((item: any, index: number) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label={translate("recordsManagement.subsidyForm")}
            select
            className={classes.textfield}
            value={`${subsidyForm == undefined ? "" : subsidyForm}`}
            onChange={(e) =>
              dispatch({
                type: "onSelect",
                name: "subsidyForm",
                value: e.target.value,
              })
            }
          >
            {subsidyForms.map((item: any, index: number) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label={translate("recordsManagement.beneficiaries")}
            select
            className={classes.textfield}
            value={`${beneficiary == undefined ? "" : beneficiary}`}
            onChange={(e) => dispatch({ type: "selectBeneficiary", e })}
          >
            {beneficiaries.map((item: any, index: number) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Grid item xs={4} justifyContent="flex-end" sx={{ display: "flex" }}>
        <TextField
          label={translate("common.year")}
          className={classes.textfield}
          value={`${year.year}`}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
    </Grid>
  );
}
