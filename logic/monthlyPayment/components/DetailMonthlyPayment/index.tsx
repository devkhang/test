import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import useLocales from "src/hooks/useLocales";

import { Box, Stepper, Step, StepButton, Typography } from "@material-ui/core";
import detailMonthlyReducer from "./detailMonthlyReducer";
import FormDialog from "logic/components/dialogs/FormDialog";
import Confirm from "logic/components/dialogs/Confirm";
import { styles, ListInfo, DetailedList } from "logic/monthlyPayment";

interface Props {
  openKey: number;
  params: any;
  refresh: any;
}
const initialState = {
  period: [],
  info: {},
  wards: [],
  listId: null,
  open: false,
  openConfirm: false,
  loading: false,
  activeStep: 0,
  completed: {
    0: false,
    1: false,
  },
  lastMonthItem: null,
};

const steps = ["recordsManagement.infomation", "paymentList.detailList"];

const length = steps.length - 1;

function DetailMonthlyPayment(props: Props) {
  const { openKey, refresh } = props;
  const { row, province, category, form, doet } = props.params;
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const classes = styles();

  const [state, dispatch] = useReducer({
    name: "detailMonthlyReducer",
    reducer: detailMonthlyReducer,
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
    listId,
    period,
    lastMonthItem,
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
                {translate(step)}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <br />
        {activeStep === 0 && (
          <ListInfo {...{ dispatch, info, wards, period, doet }} />
        )}
        {activeStep === 1 && (
          <DetailedList
            {...{
              province,
              district: info?.district,
              ward: info?.ward,
              listId,
              category,
              code: info?.code,
              form,
              doet,
              lastMonthItem,
            }}
          />
        )}
      </Box>
      <Confirm
        open={openConfirm}
        onYes={() => dispatch("closeModal")}
        onClose={() => dispatch("closeConfirm")}
      >
        <Typography variant="h6" gutterBottom>
          {translate("recordsManagement.contentConfirm")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {translate("recordsManagement.contentConfirm2")}
        </Typography>
      </Confirm>
    </FormDialog>
  );
}

export default DetailMonthlyPayment;
