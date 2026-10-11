import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import useLocales from "src/hooks/useLocales";

import { Box, Stepper, Step, StepButton, Typography } from "@material-ui/core";
import detailReducer from "./detailReducer";
import FormDialog from "logic/components/dialogs/FormDialog";
import Confirm from "logic/components/dialogs/Confirm";
import { GeneralInfo, DetailInfo, styles } from "logic/implementationList";

interface Props {
  openKey: number;
  params: any;
  refresh: any;
}
const initialState = {
  info: {},
  district: {},
  wards: [],
  codes: [],
  listId: null,
  open: false,
  checked: false,
  openConfirm: false,
  loading: true,
  activeStep: 0,
  completed: {
    0: false,
    1: false,
  },
};

const steps = ["Thông tin chung", "Danh sách chi tiết"];

const length = steps.length - 1;

function DetailImplementationList(props: Props) {
  const { openKey, refresh } = props;
  const { row } = props.params;

  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const classes = styles();

  const [state, dispatch] = useReducer({
    name: "detailReducer",
    reducer: detailReducer,
    enqueueSnackbar,
    translate,
    initialState,
    props,
    steps,
  });

  const {
    info,
    open,
    openConfirm,
    activeStep,
    completed,
    wards,
    codes,
    unit,
    listId,
    checked,
    err,
  } = state;

  useEffect(() => {
    if (openKey !== 0) {
      dispatch("initial");
    }
  }, [openKey]);

  useEffect(() => {
    if (!open) {
      refresh();
    }
  }, [open]);

  return (
    <FormDialog
      fullScreen
      open={open}
      yes={
        activeStep === length
          ? translate("common.finish")
          : translate("common.continue")
      }
      onClose={() => dispatch("openConfirm")}
      onYes={() => dispatch("continue")}
      onCheck={
        activeStep === 1 ? (e) => dispatch({ type: "onCheck", e }) : null
      }
      checked={checked}
    >
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel nonLinear={!!row.id}>
          {steps.map((step, idx) => (
            <Step key={step} completed={completed[idx]}>
              <StepButton
                color="inherit"
                onClick={() => dispatch({ type: "handleStep", idx })}
                className={
                  activeStep === idx ? classes.currentStep : classes.stepButton
                }
              >
                {step}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <br />
        {activeStep === 0 && (
          <GeneralInfo
            dispatch={dispatch}
            data={{ info, wards, codes, unit, err }}
          />
        )}
        {activeStep === 1 && (
          <DetailInfo
            listId={listId}
            row={row}
            deliverItem={(checked) => dispatch({ type: "onChange", checked })}
          />
        )}
      </Box>
      <Confirm
        open={openConfirm}
        onYes={() => dispatch("closeModal")}
        onClose={() => dispatch("closeConfirm")}
      >
        <Typography variant="h6" gutterBottom>
          {translate("recordsManagement.contentConfirm1")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {translate("recordsManagement.contentConfirm2")}
        </Typography>
      </Confirm>
    </FormDialog>
  );
}

export default DetailImplementationList;
