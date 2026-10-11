import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import useLocales from "src/hooks/useLocales";

import { Box, Stepper, Step, StepButton, Typography } from "@material-ui/core";
import FormDialog from "logic/components/dialogs/FormDialog";
import Confirm from "logic/components/dialogs/Confirm";
import reducer from "./reducer";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { styles } from "./style";
import TableTN from "./TableTN";

interface Props {
  open: boolean;
  onClose: () => void;
  deliverItem: any;
  params: any;
}

export const steps = [
  "steps.recordInfo",
  "steps.mtpReceiverInfo",
  "steps.mtpInfo",
];

const initialState = {
  loading: false,
  currentStep: 0,
  districts: [],
  wards: [],
  profiles: [],
  profile: {},
  step1: {},
  step2: {},
  step3: {},
  openTB: false,
  rowsTB: [],
  completed: {
    0: false,
    1: false,
    2: false,
  },
};

function DetailRecords(props: Props) {
  const { open, onClose } = props;
  const { row, categories, doet } = props.params;
  const classes = styles();

  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const [state, dispatch] = useReducer({
    name: reducer.name,
    reducer,
    enqueueSnackbar,
    translate,
    initialState,
    props,
  });

  useEffect(() => {
    if (open) {
      dispatch("initialLoad");
    }
  }, [open]);

  const {
    currentStep,
    step1,
    step2,
    step3,
    wards,
    profiles,
    profile,
    openTB,
    completed,
    loading,
  } = state;

  const listRelative = (step1.profile?.infoBeneficiary || []).filter(
    (i: any) => !!i?.relative
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1
            {...{
              step1,
              doet,
              wards,
              categories,
              profiles,
              dispatch,
              listRelative,
              translate,
              loading,
            }}
          />
        );
      case 1:
        return (
          <Step2 {...{ step2, dispatch, listRelative, translate, loading }} />
        );
      case 2:
        return <Step3 {...{ dispatch, step3, profile, loading }} />;
      default:
        return (
          <Step1
            {...{
              step1,
              doet,
              wards,
              categories,
              profiles,
              dispatch,
              translate,
            }}
          />
        );
    }
  };

  return (
    <FormDialog
      maxWidth={"xl"}
      open={open}
      yes={translate(
        `${currentStep === 2 ? "common.finish" : "common.continue"}`
      )}
      onClose={onClose}
      onYes={() => dispatch("onContinue")}
    >
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={currentStep} alternativeLabel nonLinear={!!row.id}>
          {steps.map((step, index) => (
            <Step key={step} completed={completed[index]}>
              <StepButton
                color="inherit"
                onClick={() =>
                  dispatch({ type: "onSelectStep", payload: { step: index } })
                }
                className={
                  currentStep === index
                    ? classes.currentStep
                    : classes.stepButton
                }
              >
                {translate(step)}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <br />

        {renderStep()}
      </Box>

      <Confirm
        open={false}
        onYes={() => dispatch({ type: "continue", name: "confirm" })}
        onClose={() => dispatch("closeModal")}
      >
        <Typography variant="h6" gutterBottom>
          {translate("recordsManagement.contentConfirm")}
        </Typography>
      </Confirm>
      <TableTN dispatch={dispatch} open={openTB} list={listRelative || []} />
    </FormDialog>
  );
}

export default DetailRecords;
