import React from "react";
import { TableCell, TextField, IconButton } from "@material-ui/core";
import NumberFormat from "react-number-format";

import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CreateIcon from "@material-ui/icons/Create";

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
    headerClass: "clsStt",
    renderCell: ({ rowIdx }: IRenderCeil) => (
      <TableCell key={rowIdx} className="clsStt">
        {rowIdx + 1}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("common.year")}</TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.year}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("preferentialTreament.insuranceMoney")}
      </TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          `${item?.fee}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        ) : (
          <NumberFormat
            customInput={TextField}
            thousandsGroupStyle="thousand"
            value={item?.fee || ""}
            decimalSeparator="."
            displayType="input"
            type="text"
            thousandSeparator={true}
            allowNegative={false}
            onChange={event("onChange", {
              name: "fee",
              item,
              rowIdx,
            })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx} className="clsAction">
        {data.translate("common.action")}
      </TableCell>
    ),
    renderCell: ({ data, item, event, rowIdx }: IRenderCeil) => {
      return (
        <TableCell key={rowIdx} className="clsAction fix">
          {item.isEdit ? (
            <>
              <IconButton
                title={data.translate("common.back")}
                onClick={event("setEdit", { rowIdx })}
              >
                <ArrowBackIcon sx={{ color: "#FF0000" }} />
              </IconButton>
              <IconButton
                title={data.translate("common.save")}
                onClick={event("save", { rowIdx, item })}
              >
                <SaveIcon sx={{ color: "primary.main" }} />
              </IconButton>
            </>
          ) : (
            <IconButton
              title={data.translate("common.new")}
              onClick={event("setEdit", { rowIdx })}
            >
              <CreateIcon sx={{ color: "primary.main" }} />
            </IconButton>
          )}
        </TableCell>
      );
    },
  },
];
