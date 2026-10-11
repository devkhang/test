import _ from "lodash";
import {
  TableCell,
  IconButton,
  TextField,
  Stack,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import {
  SearchOutlined as SearchOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
} from "@material-ui/icons";
import {
  paidType,
  Type,
  convertCurrency,
} from "logic/monthlyPayment/components/utils";
import NumberFormat from "react-number-format";
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

const SmallTextField = (props: Object) => <TextField size="small" {...props} />;

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
      <TableCell key={index} className="receiveDate">
        {data.translate("paymentList.amountPaid")}
      </TableCell>
    ),
    renderCell: ({ event, rowIdx, colIdx, item }) => (
      <TableCell key={colIdx} className="receiveDate">
        {!!item.isFather ? (
          ""
        ) : item.paid === Type.Paid ? (
          <NumberFormat
            customInput={SmallTextField}
            thousandsGroupStyle="thousand"
            value={item?.paidMoney || ""}
            decimalSeparator="."
            displayType="input"
            type="text"
            thousandSeparator={true}
            allowNegative={false}
            onChange={event("onChange", { name: "paidMoney", item, rowIdx })}
          />
        ) : (
          convertCurrency(item.paidMoney)
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: IRenderCeil) => (
      <TableCell key={index} className="date">
        {data.translate("paymentList.receiveDate")}
      </TableCell>
    ),
    renderCell: ({ event, rowIdx, colIdx, item }) => (
      <TableCell key={colIdx} className="date">
        {!!item.isFather ? (
          ""
        ) : item.paid === Type.Paid ? (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack>
              <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                value={item?.receiveDate || null}
                onChange={event("onChange", {
                  name: "receiveDate",
                  rowIdx,
                  item,
                })}
                renderInput={(params) => <TextField {...params} size="small" />}
              />
            </Stack>
          </LocalizationProvider>
        ) : (
          `${convertDateToString(item.receiveDate)}`
        )}
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
        {!!item.isFather ? "" : item.name}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: any) => (
      <TableCell key={index} className="clsStatus">
        {data.translate("common.status")}
      </TableCell>
    ),
    renderCell: ({ data, item, colIdx, rowIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className="clsStatus">
        {!!item.isFather ? (
          ""
        ) : (
          <FormControl fullWidth>
            <Select
              size="small"
              value={item?.paid}
              className={item.paid === Type.Paid ? "redTxt" : "colorTxt"}
              onChange={(e) => {
                data.dispatch({
                  type: "changeStatus",
                  rowIdx,
                  value: +e.target.value,
                });
              }}
            >
              {Object.keys(paidType).map((key: any) => (
                <MenuItem key={key} value={key}>
                  {paidType[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </TableCell>
    ),
  },
];
