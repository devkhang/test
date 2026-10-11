import React, { useEffect } from "react";
import { useReducer } from "@vna/lib/dist/commons";
import { Loading } from "@vna/lib/dist/components";
import FormDialog from "logic/components/dialogs/FormDialog";
import { Grid } from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import showDetailReducer from "./showDetailReducer";
import {
  renderRecordInfo,
  renderInforReceiverBurialFee,
  renderInforBurialFee,
} from "logic/burialFee/utils";
import { grid } from "../../utils";
import { makeStyles } from "@material-ui/styles";

export const styles = makeStyles(() => ({
  title: { marginBottom: "16px" },
  header: { margin: "16px 0" },
}));

interface Props {
  open: boolean;
  row: any;
  onClose: () => void;
}

const initialState = {
  loading: true,
  recordInfo: {},
  inforReceiver: {},
  inforBurialFee: {},
};

const ShowDetail = (props: Props) => {
  const { open, onClose } = props;
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const classes = styles();

  const [state, dispatch] = useReducer({
    reducer: showDetailReducer,
    name: "showDetailReducer",
    enqueueSnackbar,
    translate,
    initialState,
    props,
  });

  useEffect(() => {
    if (open) dispatch("initial");
  }, [open]);

  const { loading, recordInfo, inforReceiver, inforBurialFee } = state;

  return (
    <FormDialog
      maxWidth={"xl"}
      open={open}
      onClose={onClose}
      cancel={translate("common.back")}
    >
      <Loading loading={loading}>
        <h3 className={classes.title}>{translate("steps.recordInfo")}</h3>
        <Grid container spacing={4}>
          {(renderRecordInfo() || []).map((item: any) =>
            grid({ ...item, translate, data: recordInfo })
          )}
        </Grid>
        <h3 className={classes.header}>
          {translate("burialFee.inforReceiverBurialFee")}
        </h3>
        <Grid container spacing={4}>
          {(renderInforReceiverBurialFee() || []).map((item: any) =>
            grid({ ...item, translate, data: inforReceiver })
          )}
        </Grid>
        <h3 className={classes.header}>
          {translate("burialFee.inforBurialFee")}
        </h3>
        <Grid container spacing={4}>
          {inforBurialFee.type === 0
            ? (renderInforBurialFee("once") || []).map((item: any) =>
                grid({ ...item, translate, data: inforBurialFee })
              )
            : (renderInforBurialFee("monthly") || []).map((item: any) =>
                grid({ ...item, translate, data: inforBurialFee })
              )}
        </Grid>
      </Loading>
    </FormDialog>
  );
};

export default ShowDetail;
