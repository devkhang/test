import React from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Link,
  Stack,
  Button,
  IconButton,
  TableCell,
  Typography,
  Card,
} from "@material-ui/core";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

import { useReducer } from "@vna/lib/dist/commons";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import { CommonTable, Loading } from "@vna/lib/dist/components";

import { getNameById } from "../../../index";
import importFileReducer from "./importFileReducer";
import { UploadIllustration } from "src/assets";
import { style } from "./style";

const columns = [
  {
    renderHeader: ({ index, data }: any) => (
      <TableCell className="clsUsername fix" key={index}>
        {data.translate("common.username")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} className={`${!!item.isError ? "red" : ""}`}>
        {item.username}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: any) => (
      <TableCell className="fix" key={index}>
        {data.translate("common.fullName")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} className={`${!!item.isError ? "red" : ""}`}>
        {item.fullName}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: any) => (
      <TableCell className="fix" key={index}>
        {data.translate("common.position")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} className={`${!!item.isError ? "red" : ""}`}>
        {item.realRole}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: any) => (
      <TableCell className="fix" key={index}>
        {data.translate("userManager.typeUser")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx, data }: any) => (
      <TableCell key={colIdx} className={`${!!item.isError ? "red" : ""}`}>
        {getNameById(data.roles, item.role)}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: any) => (
      <TableCell key={index} className="clsAction fix">
        {data.translate("common.action")}
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, colIdx, event }: any) => (
      <TableCell
        key={colIdx}
        className={`${!!item.isError ? "red" : ""} clsActionBD`}
      >
        <IconButton onClick={event("delete", { rowIdx })}>
          <CloseOutlinedIcon />
        </IconButton>
      </TableCell>
    ),
  },
];

const initialState = {
  rows: [],
  loding: false,
};

export default function ImportFile(props: any) {
  const classes = style();
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

  const {
    datas: { roles },
  } = props;
  const { rows, loading } = state;

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
            <CommonTable
              columns={columns}
              rows={rows}
              data={{ roles, translate }}
              event={(type: string, data: any) =>
                (ele: any, ...rest: any) => {
                  dispatch({ type, data, ele, rest });
                }}
              classes={classes}
            />
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
            sx={{ color: "white", mr: 1.5 }}
            variant="contained"
            onClick={() => dispatch("saveNew")}
          >
            {translate("common.btnSave")}
          </Button>
        </Stack>
      )}
    </Box>
  );
}
