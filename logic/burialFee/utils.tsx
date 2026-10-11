import moment from "moment";
import { TextField, Grid } from "@material-ui/core";

export const genders = ["Nam", "Nữ"];

export function renderValue(name, data) {
  switch (name) {
    case "gender":
      return genders[data[name]];
    case "place":
    case "province":
    case "district":
    case "ward":
      return data[name]?.value;
    default:
      return data[name];
  }
}

export function setValue(name, isDate, isMoney, data) {
  let val: any = "";
  const date = data[name] ? moment(data[name]).format("L") : "";

  if (isDate) {
    val = date === "Invalid date" ? "" : date;
  } else if (isMoney) {
    val = !!data[name]
      ? `${data[name] || ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "0";
  } else val = renderValue(name, data) || "";

  return val;
}

export function grid({ label, name, isDate, isMoney, translate, data }) {
  const date = data[name] ? moment(data[name]).format("L") : "";
  return (
    <Grid
      item
      xs={12}
      sm={name === "address" || name === "nativePlace" ? 6 : 3}
    >
      <TextField
        fullWidth
        label={translate(label)}
        value={setValue(name, isDate, isMoney, data)}
        InputProps={{
          readOnly: true,
        }}
      />
    </Grid>
  );
}

export function renderRecordInfo() {
  return [
    { label: "recordsManagement.code", name: "code" },
    { label: "userManager.fullName", name: "fullName" },
    {
      label: "userManager.dateOfBirth",
      name: "dateOfBirth",
    },
    { label: "recordsManagement.gender", name: "gender" },
    { label: "recordsManagement.deadTime", name: "dead" },
    { label: "recordsManagement.province", name: "province" },
    { label: "recordsManagement.district", name: "district" },
    { label: "recordsManagement.ward", name: "ward" },
    { label: "recordsManagement.nativePlace", name: "nativePlace" },
    { label: "recordsManagement.address", name: "address" },
  ];
}

export function renderInforReceiverBurialFee() {
  return [
    { label: "common.fullName", name: "fullName" },
    {
      label: "userManager.dateOfBirth",
      name: "dateOfBirth",
    },
    { label: "recordsManagement.gender", name: "gender" },
    { label: "burialFee.relationship", name: "relation" },
    { label: "recordsManagement.nativePlace", name: "nativePlace" },
    ,
    { label: "recordsManagement.district", name: "district" },
    { label: "recordsManagement.ward", name: "ward" },
  ];
}

export function renderInforBurialFee(type: string) {
  switch (type) {
    case "once":
      return [
        { label: "recordsManagement.decidedPTDHIp", name: "decided" },
        {
          label: "recordsManagement.decidedDateIp",
          name: "decidedDate",
          isDate: true,
        },
        { label: "burialFee.decidedPerson", name: "decidedPerson" },
        { label: "burialFee.mtpMoney", name: "fee", isMoney: true },
        { label: "burialFee.oneSubsidy", name: "sumSubsidies", isMoney: true },
        { label: "burialFee.deadMoneyMonth", name: "deadMoney", isMoney: true },
        { label: "burialFee.stopDate", name: "stopDate", isDate: true },
        { label: "burialFee.mtpDate", name: "startDate", isDate: true },
      ];

    case "monthly":
      return [
        { label: "recordsManagement.decidedPTDHIp", name: "decided" },
        {
          label: "recordsManagement.decidedDateIp",
          name: "decidedDate",
          isDate: true,
        },
        { label: "burialFee.decidedPerson", name: "decidedPerson" },
        { name: "sumSubsidy", label: "burialFee.sumSubsidy", isMoney: true },
        {
          name: "sumAllowance",
          label: "burialFee.sumAllowance",
          isMoney: true,
        },
        { name: "month3", label: "burialFee.3Month", isMoney: true },
        { label: "burialFee.mtpMoney", name: "fee", isMoney: true },
        { name: "deadMoney", label: "burialFee.deadMoney", isMoney: true },
        { label: "burialFee.stopDate", name: "stopDate", isDate: true },
        { label: "burialFee.mtpDate", name: "startDate", isDate: true },
      ];
    default:
      return [];
  }
}
