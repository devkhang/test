import { TextField, Stack } from "@material-ui/core";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

export const gender = ["Nam", "Nữ"];
export const paymentUnit = ["Tỉnh/ Thành Phố", "Quận/ Huyện", "Phường/ Xã"];
export const paidType = ["Chưa chi trả", "Đã chi trả"];

export enum ListPaid {
  Added,
  Paid,
}

export enum Type {
  Paid,
  Excute,
}

export enum Status {
  NotAprroved,
  Approved,
  Paid,
  Complete,
}

export const subsidyForms = [
  { id: 0, name: "Một lần" },
  { id: 1, name: "Hàng tháng" },
  { id: 2, name: "Hàng năm" },
  { id: 3, name: "Bổ sung" },
];

export function renderRows(profiles) {
  let childArr: any = [];
  let array: any = [];
  for (let i = 0; i < (profiles || []).length; i++) {
    const numberChild = childArr.filter(
      (c: any) => profiles[i].name === c.name
    );
    childArr = profiles.filter((p: any) => profiles[i].name === p.name);
    if (numberChild.length > 0) continue;
    array = [...array, { name: profiles[i].name, isFather: true }, ...childArr];
  }
  return array;
}

export function convertCurrency(str: string) {
  str = !!str ? str.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
  return str;
}

export function getMonth(year: string) {
  let months: any = [];
  for (let i = 1; i < 13; i++) {
    months = [...months, `${i}/${year}`];
  }
  return months;
}

export function Field({ label, value, name, dispatch, type }: any) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value || ""}
      onChange={(e) => dispatch({ type, name, value: e.target.value })}
    />
  );
}

export function Date({ classes, label, value, name, dispatch, type }: any) {
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack>
        <DesktopDatePicker
          label={label}
          inputFormat="dd/MM/yyyy"
          value={value || null}
          onChange={(e: any) => {
            dispatch({ type, name, value: e });
          }}
          renderInput={(params: any) => (
            <TextField
              {...params}
              fullWidth
              helperText={false}
              className={classes || ""}
            />
          )}
        />
      </Stack>
    </LocalizationProvider>
  );
}

export function Table({
  loading,
  columns,
  rows,
  data,
  classes,
  dispatch,
}: any) {
  return (
    <Loading loading={loading}>
      <CommonTable
        columns={columns}
        rows={rows}
        data={data}
        classes={classes}
        event={(type: any, data: any) =>
          (ele: any, ...rest: any[]) => {
            dispatch({ type, data, ele, rest });
          }}
      />
    </Loading>
  );
}
