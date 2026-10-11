import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import useLocales from "src/hooks/useLocales";

import { Box, Stepper, Step, StepButton, Typography } from "@material-ui/core";
import detailRecordsReducer from "./detailRecordReducer";
import FormDialog from "logic/components/dialogs/FormDialog";
import Confirm from "logic/components/dialogs/Confirm";
import {
  AddressInfo,
  RecordsInfo,
  NccInfo,
  ImportFile,
  BeneficiaryInfo,
  Preferential,
} from "../components";
import { steps, martyrSteps } from "../util";
import { style } from "../style";

interface Props {
  openKey: number;
  categoryKey: string;
  categoryId: number;
  row: any;
  doet: any;
  refresh: any;
}
const initialState = {
  data: {},
  err: {},
  provinces: [],
  profile: null,
  open: false,
  confirmCancel: false,
  confirmSave: false,
  confirmHandleStep: false,
  loading: false,
  isAdd: false,
  activeStep: 0,
  completed: {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  },
  currentStep: 0,
  point: 0,
};

const length = steps.length - 1;

function DetailRecords(props: Props) {
  const { openKey, categoryKey, row, refresh, categoryId, doet } = props;
  const classes = style({});
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const [state, dispatch] = useReducer({
    name: "detailRecordsReducer",
    reducer: detailRecordsReducer,
    enqueueSnackbar,
    translate,
    initialState,
    props,
    steps,
  });

  const {
    open,
    confirmCancel,
    confirmSave,
    confirmHandleStep,
    completed,
    provinces,
    activeStep,
    profile,
    err,
    currentStep,
    index,
    point,
  } = state;
 
  useEffect(() => {
    if (openKey !== 0) {
      dispatch("initial");
      dispatch("showModal");
    }
  }, [openKey]);

  useEffect(() => {
    if (!open) {
      refresh();
    }
  }, [open]);
  const findStep = (activeStep, categoryKey) => {
    switch (activeStep) {
      case 0:
        return (
          <RecordsInfo
            profile={!!row.id ? row.id : profile}
            categoryKey={categoryKey}
            errors={err}
          />
        );
      case 1:
        return (
          <NccInfo
            profile={!!row.id ? row.id : profile}
            categoryKey={categoryKey}
            provinces={provinces}
            errors={err}
          />
        );
      case 2:
        return (
          <AddressInfo
            profile={!!row.id ? row.id : profile}
            categoryKey={categoryKey}
            doet={doet}
            errors={err}
          />
        );
      case 3:
        return categoryKey === "LS" ? (
          <BeneficiaryInfo
            profile={!!row.id ? row.id : profile}
            categoryKey={categoryKey}
            provinces={provinces}
            doet={doet}
            isAdd={(name) => dispatch({ type: "isAdd", name })}
            errors={err}
          />
        ) : (
          <ImportFile
            profile={!!row.id ? row.id : profile}
            categoryKey={categoryKey}
          />
        );
      case 4:
        return categoryKey === "LS" ? (
          <ImportFile
            profile={!!row.id ? row.id : profile}
            categoryKey={categoryKey}
          />
        ) : (
          <BeneficiaryInfo
            profile={!!row.id ? row.id : profile}
            categoryKey={categoryKey}
            provinces={provinces}
            doet={doet}
            isAdd={(name) => dispatch({ type: "isAdd", name })}
            errors={err}
          />
        );
      case 5:
        return (
          <Preferential
            categoryKey={categoryKey}
            profile={!!row.id ? row.id : profile}
            categoryId={categoryId}
          />
        );
    }
  };

  return (
    <FormDialog
      fullScreen
      open={open}
      onClose={() => dispatch({ type: "confirmOpen", name: "confirmCancel" })}
      onYes={
        activeStep !== 5
          ? () => dispatch({ type: "confirmOpen", name: "confirmSave" })
          : null
      }
      onContinue={() => dispatch("continue")}
      continues={
        activeStep === length
          ? translate("common.finish")
          : translate("common.continue")
      }
    >
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel nonLinear={true}>
          {(categoryKey === "LS" ? martyrSteps : steps).map((step, idx) => (
            <Step key={step} completed={completed[idx]}>
              <StepButton
                disabled={!!row.id ? point < idx : currentStep < idx}
                color="inherit"
                onClick={() =>
                  dispatch(
                    activeStep === 0 || !!row.id
                      ? { type: "handleStep", idx }
                      : { type: "onClickStepper", idx }
                  )
                }
                className={
                  currentStep === idx ? classes.currentStep : classes.stepButton
                }
              >
                {translate(step)}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <br />
        {findStep(activeStep, categoryKey)}
      </Box>
      <Confirm
        open={confirmCancel}
        onYes={() => dispatch("closeModal")}
        onClose={() =>
          dispatch({ type: "closeConfirm", name: "confirmCancel" })
        }
        cancel={translate("common.btnNo")}
        yes={translate("common.btnYes")}
      >
        <Typography variant="h6" gutterBottom>
          {translate("recordsManagement.confirmCancel")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {translate("recordsManagement.contentConfirm2")}
        </Typography>
      </Confirm>

      <Confirm
        open={confirmSave}
        onYes={() => dispatch({ type: "continue", name: "save" })}
        onClose={() => dispatch({ type: "closeConfirm", name: "confirmSave" })}
        cancel={translate("common.btnNo")}
        yes={translate("common.btnYes")}
      >
        <Typography variant="h6" gutterBottom>
          {translate("recordsManagement.confirmSave")}
        </Typography>
      </Confirm>

      <Confirm
        open={confirmHandleStep}
        onYes={() =>
          dispatch({
            type: "handleStep",
            idx: index,
          })
        }
        onClose={() =>
          dispatch({ type: "closeConfirm", name: "confirmHandleStep" })
        }
        cancel={translate("common.btnNo")}
        yes={translate("common.btnYes")}
      >
        <Typography variant="h6" gutterBottom>
          {translate("recordsManagement.contentConfirm3")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {translate("recordsManagement.contentConfirm2")}
        </Typography>
      </Confirm>
    </FormDialog>
  );
}

export default DetailRecords;
