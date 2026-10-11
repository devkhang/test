import React from "react";
import { TableCell, Button, IconButton, TextField } from "@material-ui/core";

import { convertDateToString } from "@vna/lib/dist/commons/utils";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import CreateIcon from "@material-ui/icons/Create";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import { DateInput } from "../utils";

interface IRenderCeil {
  item: any;
  event: any;
  classes: any;
  column: {}[];
  rowIdx: number;
  colIdx: number;
  data: any;
}
export const columnsCM = [
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{"Thời gian bắt đầu"}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          `${convertDateToString(item?.startDate)}`
        ) : (
          <DateInput
            {...{
              event,
              item,
              name: "startDate",
              dispatch: "changeRevolution",
              rowIdx,
              error: data.errors?.startDateR,
            }}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{"Thời gian kết thúc"}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          `${convertDateToString(item?.endDate)}`
        ) : (
          <DateInput
            {...{
              event,
              item,
              name: "endDate",
              dispatch: "changeRevolution",
              rowIdx,
              error: data.errors?.endDateR,
            }}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{"Cơ quan đơn vị"}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.organ
        ) : (
          <TextField
            variant="outlined"
            value={item?.organ || ""}
            error={data.errors?.organR || false}
            onChange={event("changeRevolution", {
              name: "organ",
              item,
              rowIdx,
            })}
          />
        )}
      </TableCell>
    ),
  },
  {
    isShow: "hxinh",
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{"Cấp bậc/ chức vụ"}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.rank
        ) : (
          <TextField
            variant="outlined"
            value={item?.rank || ""}
            error={data.errors?.rank || false}
            onChange={event("changeRevolution", { name: "rank", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{"Địa bàn hoạt động"}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.area
        ) : (
          <TextField
            variant="outlined"
            value={item?.area || ""}
            error={data.errors?.area || false}
            onChange={event("changeRevolution", { name: "area", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ event, rowIdx }: IRenderCeil) => (
      <TableCell key={rowIdx} className="clsAction fix">
        <Button
          onClick={event("addNew", { rowIdx, setItem: "inprogressRevolution" })}
          sx={{ color: "#fff" }}
          title={"Thêm mới"}
        >
          <AddIcon />
        </Button>
      </TableCell>
    ),
    renderCell: ({ item, event, rowIdx }: IRenderCeil) => {
      return (
        <TableCell key={rowIdx} className="clsAction fix">
          {item.isEdit ? (
            <>
              <IconButton
                title={"Quay về"}
                onClick={event("editRevolution", { rowIdx })}
              >
                <ArrowBackIcon sx={{ color: "#FF0000" }} />
              </IconButton>
              <IconButton
                title={"Lưu lại"}
                onClick={event("saveRevolution", { rowIdx, item })}
              >
                <SaveIcon sx={{ color: "primary.main" }} />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                title={"Tạo mới"}
                onClick={event("editRevolution", { rowIdx })}
              >
                <CreateIcon sx={{ color: "primary.main" }} />
              </IconButton>
              <IconButton
                title={"Xóa"}
                onClick={event("delete", {
                  item,
                  setItem: "inprogressRevolution",
                })}
              >
                <ClearSharpIcon sx={{ color: "#FF0000" }} />
              </IconButton>
            </>
          )}
        </TableCell>
      );
    },
  },
];
export const columnCM = columnsCM.filter((col) => !col.isShow);

export const columns = [
  {
    label: "STT",
    renderCell: ({ rowIdx }: IRenderCeil) => (
      <TableCell key={rowIdx}>{rowIdx + 1}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{"Thời gian bắt đầu"}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          `${convertDateToString(item?.startDate)}`
        ) : (
          <DateInput
            {...{
              event,
              item,
              name: "startDate",
              dispatch: "changeJailed",
              rowIdx,
              error: data.errors?.startDateJ,
            }}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{"Thời gian kết thúc"}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          `${convertDateToString(item?.endDate)}`
        ) : (
          <DateInput
            {...{
              event,
              item,
              name: "endDate",
              rowIdx,
              dispatch: "changeJailed",
              error: data.errors?.endDateJ,
            }}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{"Nơi bị tù đày"}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.organ
        ) : (
          <TextField
            variant="outlined"
            value={item?.organ || ""}
            error={data.errors?.organJ || false}
            onChange={event("changeJailed", { name: "organ", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {"Đơn vị hoạt động trước khi bị tù đày"}
      </TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.prison
        ) : (
          <TextField
            variant="outlined"
            value={item?.prison || ""}
            error={data.errors?.prison || false}
            onChange={event("changeJailed", { name: "prison", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ event, rowIdx }: IRenderCeil) => (
      <TableCell key={rowIdx} className="clsAction fix">
        <Button
          onClick={event("addNew", { rowIdx, setItem: "inprogressJailed" })}
          sx={{ color: "#fff" }}
          title={"Thêm mới"}
        >
          <AddIcon />
        </Button>
      </TableCell>
    ),
    renderCell: ({ item, event, rowIdx }: IRenderCeil) => {
      return (
        <TableCell key={rowIdx} className="clsAction fix">
          {item.isEdit ? (
            <>
              <IconButton
                title={"Quay về"}
                onClick={event("editJailed", { rowIdx })}
              >
                <ArrowBackIcon sx={{ color: "#FF0000" }} />
              </IconButton>
              <IconButton
                title={"Lưu lại"}
                onClick={event("saveJailed", { rowIdx, item })}
              >
                <SaveIcon sx={{ color: "primary.main" }} />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                title={"Tạo mới"}
                onClick={event("editJailed", { rowIdx })}
              >
                <CreateIcon sx={{ color: "primary.main" }} />
              </IconButton>
              <IconButton
                title={"Xóa"}
                onClick={event("delete", { item, setItem: "inprogressJailed" })}
              >
                <ClearSharpIcon sx={{ color: "#FF0000" }} />
              </IconButton>
            </>
          )}
        </TableCell>
      );
    },
  },
];
