import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import useLocales from "src/hooks/useLocales";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import { columns } from "./columns";

const styles = makeStyles((theme) => ({
  table: {
    "& thead .stt": {
      width: "55px",
      textAlign: "center",
    },

    "& thead .subsidy": {
      width: "170px",
    },

    "& .none": {
      display: "none",
    },
    "& tbody .action": {
      width: "70px",
      "& button": {
        color: "red",
      },
    },
    "& tbody .show": {
      width: "50px",
      "& button": {
        float: "right",
      },
      "& .open": {
        padding: 0,
        transform: "rotate(90deg)",
        transition: "0.2s",
      },
      "& .close": {
        padding: 0,
        transform: "rotate(0)",
        transition: "0.2s",
      },
    },
    "& tbody .padding": {
      paddingLeft: "30px",
      display: "flex",
      maxWidth: "550px",
      "& span": {
        display: "block",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
      "& .open": {
        padding: 0,
        transform: "rotate(90deg)",
        transition: "0.2s",
      },
      "& .close": {
        padding: 0,
        transform: "rotate(0)",
        transition: "0.2s",
      },
    },
    "& tbody .showName": {
      display: "flex",
      maxWidth: "800px",
      "& span": {
        display: "block",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
      "& .open": {
        padding: 0,
        transform: "rotate(90deg)",
        transition: "0.2s",
      },
      "& .close": {
        padding: 0,
        transform: "rotate(0)",
        transition: "0.2s",
      },
    },

    "& tbody .grand": {
      paddingLeft: "34px",
    },
  },
  padding: { padding: "8px 0" },
}));

export default function TableDialog(props: any) {
  const { dispatch, check, rows, editHead, loading } = props;
  const classes = styles();
  const { translate } = useLocales();

  return (
    <Grid className={classes.padding}>
      <Loading loading={!!loading}>
        <CommonTable
          columns={columns}
          rows={rows}
          data={{ translate, check, editHead }}
          event={(type: string, data: any) =>
            (ele: any, ...rest: any) => {
              dispatch({ type, data, ele, rest });
            }}
          classes={classes}
        />
      </Loading>
    </Grid>
  );
}
