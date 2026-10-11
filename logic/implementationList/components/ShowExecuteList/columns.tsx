import _ from "lodash";
import { TableCell, IconButton, TextField, Stack } from "@material-ui/core";
import {
  SearchOutlined as SearchOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
} from "@material-ui/icons";
import {
  paidType,
  Type,
  convertCurrency,
} from "logic/monthlyPayment/components/utils";
import { convertDateToString } from "@vna/lib/dist/commons/utils";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

interface IRenderCeil {
  item: any;
  event: any;
  classes: any;
  column: {}[];
  rowIdx: number;
  colIdx: number;
  data: any;
  index: any;
}

const textSearch = ({ data, event, name, label }: any) => {
  return !data.editHead[name] ? (
    <>
      <span>{data.translate(label)}</span>
      <IconButton onClick={event("setEditHead", { name })}>
        <SearchOutlinedIcon />
      </IconButton>
    </>
  ) : (
    <TextField
      className="textSearch"
      fullWidth
      size="small"
      placeholder={data.translate("common.search")}
      InputProps={{
        startAdornment: <SearchOutlinedIcon />,
        endAdornment: (
          <IconButton
            onClick={event("setEditHead", {
              name,
            })}
          >
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>
        ),
      }}
      onChange={_.debounce(event("onSearch", { name }), 700)}
    />
  );
};

export const columns = [
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell key={index} className="clsName">
        {textSearch({
          data,
          event,
          name: "name",
          label: "common.fullName",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className={!!item.isFather ? "color" : "clsName"}>
        {item?.name}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: any) => (
      <TableCell key={index}>
        {data.translate("paymentList.preferential")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx} title={item.prefers} className="prefers">
        {item.prefers}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell key={index} className="dateOfBirth">
        {textSearch({
          data,
          event,
          name: "dateOfBirth",
          label: "userManager.dateOfBirth",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.dateOfBirth}</TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: IRenderCeil) => (
      <TableCell key={index}>{data.translate("paymentList.money")}</TableCell>
    ),
    renderCell: ({ colIdx, item }) => (
      <TableCell key={colIdx}>
        {!!item.isFather
          ? ""
          : convertCurrency(`${+item?.allowance + +item?.subsidy}`)}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: IRenderCeil) => (
      <TableCell key={index}>
        {data.translate("paymentList.amountPaid")}
      </TableCell>
    ),
    renderCell: ({ colIdx, item }) => (
      <TableCell key={colIdx}>
        {!!item.isFather
          ? ""
          : item.paid !== Type.Paid
          ? convertCurrency(item?.paidMoney)
          : 0}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: IRenderCeil) => (
      <TableCell key={index}>
        {data.translate("paymentList.receiveDate")}
      </TableCell>
    ),
    renderCell: ({ colIdx, item }) => (
      <TableCell key={colIdx}>
        {!!item.isFather ? "" : `${convertDateToString(item?.receiveDate)}`}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell key={index}>
        {textSearch({
          data,
          event,
          name: "receiver",
          label: "paymentList.receiver",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className="receiver">
        {!!item.isFather ? "" : item?.name}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: any) => (
      <TableCell key={index} className="clsStatus">
        {data.translate("common.status")}
      </TableCell>
    ),
    renderCell: ({ data, item, colIdx }: IRenderCeil) => (
      <TableCell
        key={colIdx}
        className={item.paid === Type.Paid ? "redTxt" : "colorTxt"}
      >
        {!!item.isFather ? "" : paidType[item?.paid]}
      </TableCell>
    ),
  },
];
