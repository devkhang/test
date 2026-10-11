import FormDialog from "logic/components/dialogs/FormDialog";
import React, { useEffect } from "react";
import { CommonTable } from "@vna/lib/dist/components";
import { Grid, TextField } from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import eduDialogReducer from "./eduDialogReducer";
import { styles } from "../preferential";
import { columns } from "./columns";

const initialState = {
  open: false,
  oldRows: [],
  eduPrefers: [],
  editHead: {},
  rowsCheck: [],
  children: [],
  valueSearch: "",
};

export default function EduDialog(props: any) {
  const { data, openKey } = props;
  const { year } = data;
  const classes = styles();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer({
    reducer: eduDialogReducer,
    name: "eduDialogReducer",
    initialState,
    translate,
    enqueueSnackbar,
    props,
  });

  const { open, eduPrefers, editHead, rowsCheck, children } = state;

  useEffect(() => {
    if (openKey != 0) {
      dispatch("initial");
    }
  }, [openKey]);

  return (
    <FormDialog
      open={open}
      onClose={() => dispatch("closeDialog")}
      maxWidth="xl"
      onYes={() => {
        dispatch("onSubmit");
      }}
    >
      <Grid direction="column" alignItems="stretch">
        <Grid container className={classes.contain} spacing={2}>
          <Grid item xs={2}>
            <TextField
              fullWidth
              variant="outlined"
              label={translate("recordsManagement.subsidyForm")}
              value={translate("dashboard.annual")}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              fullWidth
              variant="outlined"
              label={translate("common.year")}
              value={`${year.year}`}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <CommonTable
          columns={columns}
          rows={eduPrefers}
          data={{ translate, rowsCheck, editHead, children }}
          event={(type: string, data: any) =>
            (ele: any, ...rest: any) => {
              dispatch({ type, data, ele, rest });
            }}
          classes={classes}
        />
      </Grid>
    </FormDialog>
  );
}
