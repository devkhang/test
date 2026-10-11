import React from "react";
import useLocales from "src/hooks/useLocales";
import { CommonTable } from "@vna/lib/dist/components";
import { TableCell, IconButton, Switch } from "@material-ui/core";
import { convertDateToString } from "@vna/lib/dist/commons/utils";
import FormDialog from "logic/components/dialogs/FormDialog";
import {
  EditOutlined as EditOutlinedIcon,
  ClearSharp as ClearSharpIcon,
} from "@material-ui/icons";
import { styles } from "./style";

const gender = ["Nam", "Nữ"];

interface IRenderCeil {
  item: any;
  event: any;
  column: {}[];
  rowIdx: number;
  colIdx: number;
  data: any;
}

const columns = [
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
      <TableCell key={colIdx}>{item?.dateOfBirth}</TableCell>
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
        {data.translate("recordsManagement.province")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.province.value}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.district")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.district.value}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.ward")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.ward.value}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.address")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.address}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.beneficiaryMain")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx, rowIdx, event }: IRenderCeil) => (
      <TableCell key={colIdx}>
        <Switch
          checked={!!item?.status}
          onClick={event("editStatus", { item, rowIdx })}
        />
      </TableCell>
    ),
  },
];

function TableTN(props: any) {
  const { open, list, dispatch } = props;
  const { translate } = useLocales();
  const classes = styles();

  return (
    <FormDialog
      maxWidth={"lg"}
      open={open}
      onClose={() => dispatch("closeDialogTB")}
      cancel={translate("burialFee.cancel")}
    >
      <CommonTable
        columns={columns}
        rows={list}
        data={{ translate }}
        classes={classes}
        event={(type: string, data: any) =>
          (ele: any, ...rest: any) => {
            dispatch({ type, data, ele, rest });
          }}
      />
    </FormDialog>
  );
}

export default TableTN;
