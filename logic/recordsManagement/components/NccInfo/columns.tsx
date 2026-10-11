import React from "react";
import { TableCell, Button, IconButton, TextField } from "@material-ui/core";

import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import CreateIcon from "@material-ui/icons/Create";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import { DateInput } from "../utils";
import classNames from "classnames";

interface IRenderCeil {
  item: any;
  event: any;
  classes: any;
  column: {}[];
  rowIdx: number;
  colIdx: number;
  data: any;
}
export const columns = [
  {
    label: "#",
    renderCell: ({ rowIdx }: IRenderCeil) => (
      <TableCell key={rowIdx}>{rowIdx + 1}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{"Họ và tên"}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.fullName
        ) : (
          <TextField
            size="small"
            value={item?.fullName || ""}
            onChange={event("onChange", { name: "fullName", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{"Năm sinh"}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          `${item?.dateOfBirth}`
        ) : (
          <TextField
            size="small"
            value={item?.dateOfBirth || ""}
            onChange={event("onChange", { name: "dateOfBirth", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {"Tình trạng dị dạng, dị tật bẩm sinh"}
      </TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, classes }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.disability
        ) : (
          <TextField
            multiline
            fullWidth
            size="small"
            value={item?.disability || ""}
            className={classes.disability}
            onChange={event("onChange", { name: "disability", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, event, rowIdx, classes }: IRenderCeil) => (
      <TableCell
        key={rowIdx}
        className={classes.ceilEnd}
        sx={{ bgcolor: "primary.main" }}
      >
        <Button
          onClick={event("addNew", { rowIdx })}
          sx={{ color: "#fff" }}
          title={"Thêm mới"}
        >
          <AddIcon />
        </Button>
      </TableCell>
    ),
    renderCell: ({ data, item, event, rowIdx }: IRenderCeil) => {
      return (
        <TableCell key={rowIdx} className="clsAction fix">
          {item.isEdit ? (
            <>
              <IconButton
                title={"Quay về"}
                onClick={event("setEdit", { rowIdx })}
              >
                <ArrowBackIcon sx={{ color: "#FF0000" }} />
              </IconButton>
              <IconButton
                title={"Lưu lại"}
                onClick={event("save", { rowIdx, item })}
              >
                <SaveIcon sx={{ color: "primary.main" }} />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                title={"Tạo mới"}
                onClick={event("setEdit", { rowIdx })}
              >
                <CreateIcon sx={{ color: "primary.main" }} />
              </IconButton>
              <IconButton title={"Xóa"} onClick={event("delete", { item })}>
                <ClearSharpIcon sx={{ color: "#FF0000" }} />
              </IconButton>
            </>
          )}
        </TableCell>
      );
    },
  },
];
