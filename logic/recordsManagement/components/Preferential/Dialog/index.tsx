import FormDialog from "logic/components/dialogs/FormDialog";
import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import HeadDialog from "./HeadDialog";
import TableDialog from "./TableDialog";
import dialogReducer from "./dialogReducer";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";

const initialState = {
  rows: [],
  categories: [],
  category: {},
  oldRows: [],
  loading: true,
  rowsCheck: [],
  open: false,
  editHead: {},
};

export default function Dialog(props: any) {
  const { data, openKey } = props;
  const { year } = data;
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

  const {
    open,
    rows,
    rowsCheck,
    subsidyForm,
    beneficiary,
    editHead,
    categories,
    category,
    loading,
  } = state;

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
        <HeadDialog
          data={{
            year,
            subsidyForm,
            beneficiary,
            categories,
            category,
          }}
          dispatch={dispatch}
        />
        <TableDialog
          loading={loading}
          check={true}
          rows={rows}
          dispatch={dispatch}
          editHead={editHead}
        />
        <TableDialog check={false} rows={rowsCheck} dispatch={dispatch} />
      </Grid>
    </FormDialog>
  );
}
