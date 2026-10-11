import React, { useEffect } from "react";
import FormDialog from "logic/components/dialogs/FormDialog";
import { CommonTable } from "@vna/lib/dist/components";
import { Typography } from "@material-ui/core";

import useLocales from "src/hooks/useLocales";
import { useReducer } from "@vna/lib/dist/commons";
import { styles } from "logic/implementationList";
import { columns } from "./columns";
import showListReducer from "./showListReducer";

const initialState = {
  loading: false,
  rows: [],
  oldRows: [],
  page: {
    pageSize: 10,
    count: 0,
    page: 0,
  },
  valueSearch: {},
  editHead: {},
};

function ShowExecuteList(props) {
  const { total, receiveDate, showDetail } = props.data;
  const { translate } = useLocales();
  const classes = styles();

  const [state, dispatch] = useReducer({
    reducer: showListReducer,
    name: "showListReducer",
    translate,
    initialState,
    props,
  });

  useEffect(() => {
    if (showDetail !== 0) dispatch("initial");
  }, [showDetail]);

  const { loading, rows, valueSearch, editHead, showDialog } = state;

  return (
    <FormDialog
      fullWidth
      maxWidth={"xl"}
      open={showDialog}
      cancel={translate("common.back")}
      onClose={() => dispatch("closeDetail")}
    >
      <CommonTable
        columns={columns}
        rows={rows}
        data={{
          translate,
          valueSearch,
          dispatch,
          editHead,
          receiveDate,
          classes,
        }}
        event={(type: string, data: any) =>
          (ele: any, ...rest: any) => {
            dispatch({ type, data, ele, rest });
          }}
        classes={classes}
      />
      <Typography>{`${translate("paymentList.total")} : ${total}`}</Typography>
    </FormDialog>
  );
}

export default ShowExecuteList;
