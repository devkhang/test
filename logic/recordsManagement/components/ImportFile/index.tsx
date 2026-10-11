import React, { useEffect } from "react";
import { useReducer } from "@vna/lib/dist/commons";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import { Grid } from "@material-ui/core";
import { importFileReducer } from "./importFileReducer";
import { Loading } from "@vna/lib/dist/components";
import { UploadFile } from "../utils";
import { styles } from "../styles";

interface Props {
  profile: string;
  categoryKey: string;
}
const initialState = {
  data: {},
  LT3: [],
  TKN3: [],
  deathFile: [],
  TQGCfile: [],
  decidedFile: [],
  injuredFile: [],
  assessmentFile: [],
  revolutionFile: [],
  rewardFile: [],
  other: [],
  loading: false,
  url: null,
};

export function ImportFile(props: Props) {
  const { categoryKey, profile } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const classes = styles();

  const [state, dispatch] = useReducer({
    reducer: importFileReducer,
    name: "importFileReducer",
    initialState,
    translate,
    enqueueSnackbar,
    props,
  });
  const {
    LT3,
    TKN3,
    deathFile,
    TQGCfile,
    decidedFile,
    injuredFile,
    assessmentFile,
    revolutionFile,
    rewardFile,
    other,
    loading,
  } = state;

  useEffect(() => {
    dispatch("initial");
  }, [profile]);

  return (
    <>
      <Loading loading={loading} className={classes.loading}>
        <Grid container spacing={5}>
          {categoryKey === "LT" && (
            <Grid item xs={12} sm={6}>
              <>
                <h3>{translate("recordsManagement.LT3Type")} </h3>
                <UploadFile {...{ files: LT3, name: "LT3", dispatch }} />
              </>
            </Grid>
          )}
          {categoryKey === "TKN" && (
            <Grid item xs={12} sm={6}>
              <h3>{translate("recordsManagement.TKN3Type")} </h3>
              <UploadFile {...{ files: TKN3, name: "TKN3", dispatch }} />
            </Grid>
          )}
          {categoryKey === "LS" && (
            <>
              <Grid item xs={12} sm={4}>
                <h3>{translate("recordsManagement.deathFile")} </h3>
                <UploadFile
                  {...{ files: deathFile, name: "deathFile", dispatch }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <h3>{translate("recordsManagement.TQGCfile")} </h3>
                <UploadFile
                  {...{ files: TQGCfile, name: "TQGCfile", dispatch }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "BM" && (
            <Grid item xs={12} sm={6}>
              <h3>{translate("recordsManagement.decidedBMVNAH")} </h3>
              <UploadFile
                {...{ files: decidedFile, name: "decidedFile", dispatch }}
              />
            </Grid>
          )}
          {(categoryKey === "AHLL" || categoryKey === "AHKC") && (
            <Grid item xs={12} sm={6}>
              <h3>{translate("recordsManagement.decidedAH")}</h3>
              <UploadFile
                {...{ files: decidedFile, name: "decidedFile", dispatch }}
              />
            </Grid>
          )}
          {categoryKey === "AQ" && (
            <>
              <Grid item xs={12} sm={4}>
                <h3>{translate("recordsManagement.injuredFile")} </h3>
                <UploadFile
                  {...{ files: injuredFile, name: "injuredFile", dispatch }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <h3>{translate("recordsManagement.assessmentFile")} </h3>
                <UploadFile
                  {...{
                    files: assessmentFile,
                    name: "assessmentFile",
                    dispatch,
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "BB" && (
            <>
              <Grid item xs={12} sm={4}>
                <h3>{translate("recordsManagement.disabilityFile")} </h3>
                <UploadFile
                  {...{ files: injuredFile, name: "injuredFile", dispatch }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <h3>{translate("recordsManagement.disabilityAssessment")}</h3>
                <UploadFile
                  {...{
                    files: assessmentFile,
                    name: "assessmentFile",
                    dispatch,
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "HH" && (
            <>
              <Grid item xs={12} sm={4}>
                <h3>{translate("recordsManagement.revolutionFile")}</h3>
                <UploadFile
                  {...{
                    files: revolutionFile,
                    name: "revolutionFile",
                    dispatch,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <h3>{translate("recordsManagement.deformityAssessment")} </h3>
                <UploadFile
                  {...{
                    files: assessmentFile,
                    name: "assessmentFile",
                    dispatch,
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "BT" && (
            <Grid item xs={12} sm={6}>
              <h3>{translate("recordsManagement.revolutionFile")}</h3>
              <UploadFile
                {...{ files: revolutionFile, name: "revolutionFile", dispatch }}
              />
            </Grid>
          )}
          {(categoryKey === "KC" || categoryKey === "CC") && (
            <Grid item xs={12} sm={6}>
              <h3>{translate("recordsManagement.rewardFile")}</h3>
              <UploadFile
                {...{ files: rewardFile, name: "rewardFile", dispatch }}
              />
            </Grid>
          )}
          <Grid
            item
            xs={12}
            sm={
              categoryKey === "LS" ||
              categoryKey === "AQ" ||
              categoryKey === "BB" ||
              categoryKey === "HH"
                ? 4
                : 6
            }
          >
            <>
              <h3>{translate("recordsManagement.otherFile")}</h3>
              <UploadFile {...{ files: other, name: "other", dispatch }} />
            </>
          </Grid>
        </Grid>
      </Loading>
    </>
  );
}
