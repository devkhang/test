import React from "react";
import useLocales from "src/hooks/useLocales";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import { TableCell, IconButton, Switch } from "@material-ui/core";
import FormDialog from "logic/components/dialogs/FormDialog";
import { EditOutlined as EditOutlinedIcon } from "@material-ui/icons";
import { gender } from "../utils";
import { styles } from "../styles";

interface IRenderCeil {
  item: any;
  event: any;
  column: {}[];
  rowIdx: number;
  colIdx: number;
  data: any;
}

export const columns = [
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("common.fullName")}</TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className="name">
        {item?.fullName}
      </TableCell>
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
      <TableCell key={colIdx} className="address">
        {data.translate("recordsManagement.nativePlace")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className="address" title={item?.nativePlace}>
        {item?.nativePlace}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.province")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className="name">
        {item?.province?.value}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.district")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.district?.value}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.ward")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.ward?.value}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx} className="address">
        {data.translate("recordsManagement.address")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className="address" title={item?.address}>
        {item?.address}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx} className="clsStatus">
        {data.translate("recordsManagement.beneficiaryMain")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx, rowIdx, event }: IRenderCeil) => (
      <TableCell key={colIdx} className="center">
        <Switch
          checked={!!item?.status}
          onClick={event("editStatus", { item, rowIdx })}
        />
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: any) => (
      <TableCell key={colIdx} className="clsStatus">
        {data.translate("common.action")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx, event, data }: any) => (
      <TableCell key={colIdx} className="center">
        <IconButton
          title={data.translate("common.update")}
          onClick={event("editInfo", { item })}
        >
          <EditOutlinedIcon />
        </IconButton>
      </TableCell>
    ),
  },
];

function TableRelative(props: any) {
  const { open, loading, list, dispatch } = props;
  const { translate } = useLocales();
  const classes = styles();

  return (
    <FormDialog
      maxWidth={"xl"}
      open={open}
      onClose={() => dispatch("closeDialog")}
    >
      <Loading loading={loading}>
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
      </Loading>
    </FormDialog>
  );
}

export default TableRelative;
