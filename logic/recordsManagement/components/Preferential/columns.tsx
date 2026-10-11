import React from "react";
import { TableCell } from "@material-ui/core";
import { convertCurrency } from "logic/monthlyPayment/components/utils";
import { subsidyForms } from "../utils";

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
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("common.stt")}</TableCell>
    ),
    renderCell: ({ rowIdx, colIdx }) => (
      <TableCell key={colIdx}>{rowIdx + 1}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.subsidyForm")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx}>
        {subsidyForms[item.subsidyForm]?.name || ""}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("paymentList.preferential")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx} title={item.name}>
        {item.name}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.subsidy")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx}>{convertCurrency(item.subsidy) || 0}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("paymentList.allowance")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx}>{convertCurrency(item.allowance) || 0}</TableCell>
    ),
  },
];
