import React from "react";
import _ from "lodash";
import { TableCell, IconButton, Checkbox, TextField } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { convertCurrency } from "logic/monthlyPayment/components/utils";

export const columns = [
  {
    label: "#",
    headerClass: "stt",
    renderCell: ({ rowIdx, colIdx, data, item, event }) => (
      <TableCell key={colIdx}>
        {!data.check ? (
          rowIdx + 1
        ) : item.isFather ? (
          ""
        ) : (
          <Checkbox
            disabled={!!item?.isExist}
            checked={!!item?.isCheck}
            onClick={event("onChecked", { item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    isHeader: false,
    renderCell: ({ rowIdx, colIdx, event, item, data }: any) => (
      <TableCell className="show" key={colIdx}>
        {!item.parentId && !!data.check && !!item.isFather && (
          <IconButton
            className={!!item.show ? "open" : "close"}
            onClick={event("show", { rowIdx })}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, index, event }: any) => (
      <TableCell key={index} className={`name`}>
        {!data.editHead?.name ? (
          <>
            <span>{data.translate("paymentList.preferential")}</span>
            {!!data.check && (
              <IconButton onClick={event("setEditHead")}>
                <SearchOutlinedIcon />
              </IconButton>
            )}
          </>
        ) : (
          <TextField
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton onClick={event("setEditHead")}>
                  <CloseOutlinedIcon fontSize="small" />
                </IconButton>
              ),
            }}
            onChange={_.debounce(event("onSearch"), 700)}
          />
        )}
      </TableCell>
    ),
    renderCell: ({ rowIdx, colIdx, item, data, event }) => (
      <TableCell
        key={colIdx}
        className={
          !item.haveChild && !!item.isChild && !!data.check
            ? "padding"
            : "showName"
        }
        title={item.name}
      >
        <>
          {!!item.isChild && !!data.check && !!item.haveChild && (
            <IconButton
              className={!!item.show ? "open" : "close"}
              onClick={event("show", { rowIdx })}
            >
              {<ChevronRightIcon />}
            </IconButton>
          )}
          <span
            className={`${!!item.isGrand && !!data.check ? "grand" : ""} span`}
          >
            {item.name || ""}
          </span>
        </>
      </TableCell>
    ),
  },
  {
    label: "Số tiền trợ cấp",
    headerClass: "subsidy",
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx}>{convertCurrency(item.subsidy) || ""}</TableCell>
    ),
  },
  {
    label: "Số tiền phụ cấp",
    headerClass: "subsidy",
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx}>
        {convertCurrency(item.allowance) || ""}
      </TableCell>
    ),
  },
  {
    isHeader: false,
    renderCell: ({ rowIdx, colIdx, data, event, item }) => (
      <TableCell key={colIdx} className="action">
        {!data.check ? (
          <IconButton onClick={event("deleteCheck", { rowIdx, item })}>
            <ClearIcon />
          </IconButton>
        ) : (
          ""
        )}
      </TableCell>
    ),
  },
];
