import React, { useEffect } from "react";
import _ from "lodash";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Link,
  Stack,
  Button,
  Typography,
  Card,
  Snackbar,
  Alert,
} from "@material-ui/core";

import { useReducer } from "@vna/lib/dist/commons";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import { CommonTable, Loading } from "@vna/lib/dist/components";

import importFileReducer from "./importFileReducer";
import { UploadIllustration } from "src/assets";
import { style } from "./style";
import { columns } from "./columns";

const vertical = "top";
const horizontal = "right";

const initialState = {
  ethnics: [],
  countAdd: 0,
  countUpdate: 0,
  countLoad: 0,
  countUser: 0,
  sumLoad: 0,
  open: false,
  rows: [],
  wards: [],
  districts: [],
  loding: false,
};

export default function ImportFile(props: any) {
  const {
    datas: { categoryKey, open: openDialog, roles },
  } = props;
  const cols = columns(categoryKey);
  const classes = style({ categoryKey });
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [state, dispatch] = useReducer({
    reducer: importFileReducer,
    name: importFileReducer.name,
    initialState,
    translate,
    enqueueSnackbar,
    props,
  });

  useEffect(() => {
    if (!openDialog) {
      dispatch("emptyRows");
    }
  }, [openDialog]);

  const {
    rows,
    loading,
    open,
    countAdd,
    countUpdate,
    countLoad,
    countUser,
    sumLoad,
  } = state;

  const data = rows.length > 0;

  const { getRootProps, getInputProps, isDragActive, isDragReject }: any =
    useDropzone({});

  return (
    <Box sx={{ width: "100%", overflowY: "auto" }}>
      <Loading loading={loading}>
        <Box sx={{ width: "100%" }}>
          <Card
            className={classes.card}
            {...getRootProps()}
            onDrop={(e) => dispatch({ type: "getFile", e, name: "onDrop" })}
            sx={{
              ...(isDragActive && { opacity: 0.72 }),
              ...(isDragReject && {
                color: "error.main",
                borderColor: "error.light",
                bgcolor: "error.lighter",
              }),
            }}
          >
            <input
              {...getInputProps()}
              multiple={false}
              accept=".xlsx, .xls, .csv"
              onChange={(e) =>
                dispatch({ type: "getFile", e, name: "onChange" })
              }
            />
            <UploadIllustration sx={{ width: 220 }} />
            <Box sx={{ p: 3, ml: { md: 2 } }}>
              <Typography gutterBottom variant="h5">
                {translate("userManager.dowFile")}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {translate("userManager.drop")}&nbsp;
                <Link underline="always">{translate("common.here")}</Link>
                &nbsp;{translate("userManager.toDow")}
              </Typography>
            </Box>
          </Card>
          {data && (
            <Box className={classes.box}>
              <CommonTable
                columns={cols}
                rows={rows}
                data={{ roles, translate }}
                event={(type: string, data: any) =>
                  (ele: any, ...rest: any) => {
                    dispatch({ type, data, ele, rest });
                  }}
                classes={classes}
              />
            </Box>
          )}
        </Box>
      </Loading>
      {data && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          className={classes.stack}
        >
          <Button sx={{ mr: 1.5 }} onClick={() => dispatch("back")}>
            {translate("common.back")}
          </Button>
          <Button
            sx={{ color: "white" }}
            variant="contained"
            onClick={() => dispatch("saveNew")}
          >
            {translate("common.btnSave")}
          </Button>
        </Stack>
      )}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        message="I love snacks"
        key={vertical + horizontal}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {sumLoad > 0 ? (
            <>
              <Typography>{`${translate(
                "recordsManagement.readingFile"
              )}: ${countLoad}/${sumLoad}`}</Typography>
              <Typography>{` ${translate(
                "recordsManagement.checkUser"
              )}: ${countUser}/${sumLoad} `}</Typography>
            </>
          ) : (
            <>
              {countAdd > 0 && (
                <Typography>
                  {`${translate("recordsManagement.addSuccess")}
                  : ${countAdd}
                  /${rows.filter((item: any) => ![1, 2].includes(item.isError)).length}`}
                </Typography>
              )}
              {countUpdate > 0 && (
                <Typography>
                  {`${translate(
                    "recordsManagement.updateSuccess"
                  )}: ${countUpdate}
                  /${rows.filter((item: any) => item.isError == 2).length}`}
                </Typography>
              )}
            </>
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
}
