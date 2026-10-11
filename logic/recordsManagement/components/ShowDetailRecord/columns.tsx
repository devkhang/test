import React from "react";
import { TableCell } from "@material-ui/core";
import { convertDateToString } from "@vna/lib/dist/commons/utils";
import { gender } from "../utils";
import moment from "moment";

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
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("statisticReport.startDate")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{convertDateToString(item?.startDate)}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("statisticReport.endDate")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{convertDateToString(item?.endDate)}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("userManager.unit")}</TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.organ}</TableCell>
    ),
  },
  {
    isShow: "hxinh",
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("userManager.level")}</TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.rank}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.operatingArea")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.area}</TableCell>
    ),
  },
];

export const columnCM = columnsCM.filter((col) => !col.isShow);

export const columnsBT = [
  {
    label: "#",
    renderCell: ({ rowIdx }: IRenderCeil) => (
      <TableCell key={rowIdx}>{rowIdx + 1}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("statisticReport.startDate")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{convertDateToString(item?.startDate)}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("statisticReport.endDate")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{convertDateToString(item?.endDate)}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.imprisonmentPlace")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.organ}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.beforeImprisonmentUnit")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.prison}</TableCell>
    ),
  },
];

export const columnsDeclaration = [
  {
    label: "#",
    renderCell: ({ rowIdx }: IRenderCeil) => (
      <TableCell key={rowIdx}>{rowIdx + 1}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("common.fullName")}
        </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.fullName}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.birthday")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.dateOfBirth}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.disability")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.disability}</TableCell>
    ),
  },
];

export const columnsRelative = [
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("common.fullName")}</TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.fullName}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("userManager.dateOfBirth")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {item?.dateOfBirth ? moment(item?.dateOfBirth).format("L") : ""}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("common.gender")}</TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{gender[item?.gender] || ""}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.nativePlace")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.nativePlace}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.martyrsRelative")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.relation}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.currentAccommodation")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.present}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.situation")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.note}</TableCell>
    ),
  },
];
