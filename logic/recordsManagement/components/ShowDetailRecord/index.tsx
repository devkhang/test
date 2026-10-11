import React, { useEffect } from "react";
import { Grid } from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { useReducer } from "@vna/lib/dist/commons";
import FormDialog from "logic/components/dialogs/FormDialog";
import showDetailReducer from "./showDetailReducer";
import {
  renderInfo,
  renderNccInfo,
  renderAddress,
  renderBeneficiary,
  renderMoveInfo,
  grid,
} from "./functions";
import _ from "lodash";
import UploadMultiFile from "./attachFiles";
import { columns } from "logic/recordsManagement/components/Preferential/columns";
import {
  columnsCM,
  columnCM,
  columnsBT,
  columnsDeclaration,
  columnsRelative,
} from "./columns";
import { Table } from "./functions";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import { styles } from "logic/recordsManagement/components/Preferential/styles";

const initialState = {
  showDialog: false,
  info: { inprogressRevolution: [], inprogressJailed: [] },
  infoNcc: { disabilitiesChildren: [] },
  moveInfo: {},
  infoAddress: {},
  files: [],
  infoBeneficiary: { beneficiary: {}, relative: {} },
  prefers: [],
  otherRelative: [],
  loading: true,
};

export function ShowDetailRecord(props: any) {
  const { showDetail, categoryKey } = props;
  const { translate } = useLocales();
  const classes = styles();

  const [state, dispatch] = useReducer({
    reducer: showDetailReducer,
    name: "showDetailReducer",
    translate,
    initialState,
    props,
  });
  useEffect(() => {
    if (showDetail !== 0) dispatch("initial");
  }, [showDetail]);

  const {
    info,
    infoNcc,
    moveInfo,
    infoAddress,
    files,
    infoBeneficiary,
    prefers,
    otherRelative,
    showDialog,
    loading,
  } = state;

  return (
    <FormDialog
      fullWidth
      maxWidth={"xl"}
      open={showDialog}
      cancel={translate("common.back")}
      onClose={() => dispatch("closeDetail")}
    >
      <Loading loading={loading}>
        <h3 className={classes.header}>
          {translate("recordsManagement.infomation")}
        </h3>

        <Grid container spacing={4}>
          {(renderInfo(categoryKey) || []).map((item: any) =>
            grid({ ...item, translate, data: info, classes })
          )}
        </Grid>
        {["HH", "BT"].includes(categoryKey) && (
          <div className={classes.grid}>
            <Table
              {...{
                columns: categoryKey === "HH" ? columnCM : columnsCM,
                rows: info?.inprogressRevolution,
                data: { translate },
                classes,
                dispatch,
              }}
            />
          </div>
        )}

        {categoryKey === "BT" && (
          <div className={classes.grid}>
            <Table
              {...{
                columns: columnsBT,
                rows: info?.inprogressJailed,
                data: { translate },
                classes,
                dispatch,
              }}
            />
          </div>
        )}
        <h3 className={classes.title}>
          {translate("recordsManagement.nccInfomation")}
        </h3>
        <Grid container spacing={4}>
          {(renderNccInfo(categoryKey) || []).map((item: any) =>
            grid({ ...item, translate, data: infoNcc, classes })
          )}
          {(renderAddress(categoryKey) || []).map((item: any) =>
            grid({ ...item, translate, data: infoAddress, classes })
          )}
        </Grid>
        {categoryKey === "HH" && (
          <div className={classes.grid}>
            <Table
              {...{
                columns: columnsDeclaration,
                rows: infoNcc?.disabilitiesChildren,
                data: { translate },
                classes,
                dispatch,
              }}
            />
          </div>
        )}
        {(!_.isEmpty(moveInfo.come) || !_.isEmpty(moveInfo.transfer)) && (
          <>
            <h4 className={classes.title}>
              {translate("recordsManagement.titleNCCMove")}
            </h4>
            {!_.isEmpty(moveInfo.transfer) && (
              <>
                <h5 className={classes.moveTitle}>
                  {translate("recordsManagement.NCCmove")}
                </h5>
                <Grid container spacing={4}>
                  {(renderMoveInfo("transfer") || []).map((item: any) =>
                    grid({
                      ...item,
                      translate,
                      data: moveInfo.transfer,
                      classes,
                    })
                  )}
                </Grid>
              </>
            )}
            {!_.isEmpty(moveInfo.come) && (
              <>
                <h5 className={classes.title}>
                  {translate("recordsManagement.NCCcome")}
                </h5>
                <Grid container spacing={4}>
                  {(renderMoveInfo("come") || []).map((item: any) =>
                    grid({ ...item, translate, data: moveInfo.come, classes })
                  )}
                </Grid>
              </>
            )}
          </>
        )}
        {!_.isEmpty(infoBeneficiary.beneficiary) && (
          <>
            <h3 className={classes.title}>
              {translate("recordsManagement.beneficiaryInfo")}
            </h3>
            <Grid container spacing={5}>
              {(renderBeneficiary("beneficiary", categoryKey) || []).map(
                (item: any) =>
                  grid({
                    ...item,
                    translate,
                    data: infoBeneficiary.beneficiary,
                    classes,
                  })
              )}
            </Grid>
          </>
        )}
        {!_.isEmpty(infoBeneficiary.relative) && (
          <>
            <h3 className={classes.title}>
              {translate("recordsManagement.relativeInfo")}
            </h3>
            <Grid container spacing={4}>
              {!_.isEmpty(infoBeneficiary.relative) &&
                (renderBeneficiary("relative", categoryKey) || []).map(
                  (item: any) =>
                    !item.isMartyrs
                      ? grid({
                          ...item,
                          translate,
                          data: infoBeneficiary.relative,
                          classes,
                        })
                      : null
                )}
            </Grid>
            {!_.isEmpty(otherRelative) && categoryKey === "LS" && (
              <>
                <h4 className={classes.title}>
                  {translate("recordsManagement.listRelative")}
                </h4>
                <CommonTable
                  columns={columnsRelative}
                  rows={otherRelative}
                  data={{ translate }}
                  event={(type: string, data: any) =>
                    (ele: any, ...rest: any) => {
                      dispatch({ type, data, ele, rest });
                    }}
                />
              </>
            )}
          </>
        )}
        {!_.isEmpty(files) && (
          <>
            <h3 className={classes.fileHeader}>
              {translate("recordsManagement.attachments")}
            </h3>
            <Grid xs={12} sm={9}>
              <UploadMultiFile files={files} classes={classes} />
            </Grid>
          </>
        )}
        {!_.isEmpty(prefers) && (
          <>
            <h3 className={!_.isEmpty(files) ? classes.header : classes.title}>
              {translate("recordsManagement.preferential")}
            </h3>
            <Table
              {...{
                columns,
                rows: prefers,
                data: { translate },
                classes,
                dispatch,
              }}
            />
          </>
        )}
      </Loading>
    </FormDialog>
  );
}
