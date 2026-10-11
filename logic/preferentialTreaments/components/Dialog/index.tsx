import FormDialog from "logic/components/dialogs/FormDialog";
import React from "react";
import { useEffect } from "react";

import { FormControlLabel, Checkbox, Typography } from "@material-ui/core";

import { CommonTable, Loading } from "@vna/lib/dist/components";
import { useReducer } from "@vna/lib/dist/commons";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import dialogReducer from "./dialogReducer";
import Information from "./Information";
import { columns } from "./columns";
import Confirm from "logic/components/dialogs/Confirm";
import { styles } from "./style";

const initialState = {
  open: false,
  datas: [],
  oldData: [],
  page: {
    pageSize: 10,
    count: 0,
    page: 0,
  },
  confirm: { open: false },
};

export default function Dialog(props: any) {
  const { openKey, data }: any = props;
  const classes = styles();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer({
    reducer: dialogReducer,
    name: dialogReducer.name,
    initialState,
    translate,
    enqueueSnackbar,
    props,
  });

  const { open, loading, check, row, datas, isShow, confirm } = state;

  useEffect(() => {
    if (openKey.open != 0) {
      dispatch("initial");
    }
  }, [openKey]);

  return (
    <FormDialog
      open={open}
      onYes={() => dispatch({ type: "onSubmit" })}
      onClose={() => dispatch("closeDialog")}
      maxWidth="lg"
    >
      <Information data={props.data} dispatch={dispatch} row={row || {}} />
      <FormControlLabel
        control={
          <Checkbox
            checked={!!check}
            onChange={(e) => dispatch({ type: "onChecked", e })}
          />
        }
        label={translate("preferentialTreament.input")}
      />
      {check && (
        <Loading loading={loading}>
          <CommonTable
            columns={columns}
            rows={datas}
            classes={classes}
            data={{ translate, valueTab: data.valueTab }}
            event={(type: any, data: any) =>
              (ele: any, ...rest: any[]) => {
                dispatch({ type, data, ele, rest });
              }}
          />
        </Loading>
      )}
      {data.valueTab === 1 && check && (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!isShow}
              onChange={(e) => dispatch({ type: "onShow", e })}
            />
          }
          label={translate("preferentialTreament.dontShow")}
        />
      )}
      <Confirm
        open={confirm.open}
        onClose={() => dispatch("closeConfirm")}
        onYes={() => dispatch("delete")}
      >
        <Typography>{confirm.content}</Typography>
      </Confirm>
    </FormDialog>
  );
}
