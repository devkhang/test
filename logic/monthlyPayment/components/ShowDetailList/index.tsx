import React, { useEffect } from "react";
import {
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { useReducer } from "@vna/lib/dist/commons";
import FormDialog from "logic/components/dialogs/FormDialog";

import { CommonTable } from "@vna/lib/dist/components";
import { styles } from "logic/monthlyPayment";
import { columns } from "./columns";
import showDetailReducer from "./showDetailReducer";

const initialState = {
  showDialog: false,
  rows: [],
  oldRows: [],
  typeCategory: {},
  valueSearch: {},
  editHead: {},
  anchorEl: {
    genders: null,
  },
  genders: [
    { name: "Nam", id: 0 },
    { name: "Nữ", id: 1 },
  ],
};

export function ShowDetailList(props: any) {
  const { detailItem, showDetail, category } = props.data;
  const { translate } = useLocales();
  const classes = styles();

  const [state, dispatch] = useReducer({
    reducer: showDetailReducer,
    name: "showDetailReducer",
    translate,
    initialState,
    props,
  });
  useEffect(() => {
    if (showDetail !== 0) dispatch("initial");
  }, [showDetail]);

  const {
    rows,
    typeCategory,
    valueSearch,
    editHead,
    anchorEl,
    genders,
    showDialog,
  } = state;

  return (
    <FormDialog
      fullWidth
      maxWidth={"xl"}
      open={showDialog}
      cancel={translate("common.back")}
      onClose={() => dispatch("closeDetail")}
    >
      <br />
      <Grid container spacing={12} className={classes.contain}>
        <Grid item xs={6} md={9}>
          <FormControl fullWidth>
            <InputLabel>{translate("paymentList.category")}</InputLabel>
            <Select
              label={translate("paymentList.category")}
              title={typeCategory?.name || ""}
              value={`${typeCategory !== undefined ? typeCategory?.id : ""}`}
              onChange={(e) =>
                dispatch({
                  type: "changeCategory",
                  value: e.target.value,
                })
              }
            >
              {category.map((item: any) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <TextField
            fullWidth
            label={translate("paymentList.code")}
            value={detailItem?.code || ""}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>

      <CommonTable
        columns={columns.filter((i) => !i.isHide)}
        rows={rows}
        data={{
          translate,
          valueSearch,
          dispatch,
          editHead,
          anchorEl,
          genders,
          classes,
        }}
        event={(type: string, data: any) =>
          (ele: any, ...rest: any) => {
            dispatch({ type, data, ele, rest });
          }}
        classes={classes}
      />
      <Typography>{`${translate("paymentList.total")} : ${
        detailItem?.total || 0
      }`}</Typography>
    </FormDialog>
  );
}
