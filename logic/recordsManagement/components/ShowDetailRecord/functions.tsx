import { TextField, Grid } from "@material-ui/core";
import { CommonTable } from "@vna/lib/dist/components";
import moment from "moment";
import { convertRewards } from "../utils";

export const gender = ["Nam", "Nữ"];

export function Table({ columns, rows, data, classes, dispatch }: any) {
  return (
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
  );
}

export function renderValue(name, data) {
  switch (name) {
    case "gender":
      return gender[data[name]];
    case "place":
    case "province":
    case "district":
    case "ward":
      return data[name]?.value;
    case "ethnic":
      return data[name]?.name;
    case "reward":
      return convertRewards[data.reward];
    case "relation":
      return data.relation === "isNcc" ? "Là NCC" : data.relation;
    case "CATime":
      return `${data?.CATime1 ? data.CATime1 + " năm" : ""} ${
        data?.CATime2 ? data.CATime2 + " tháng" : ""
      }`;
    case "CTTime":
      return `${data?.CTTime1 ? data.CTTime1 + " năm" : ""} ${
        data?.CTTime2 ? data.CTTime2 + " tháng" : ""
      }`;
    case "KKTime":
      return `${data?.KKTime1 ? data.KKTime1 + " năm" : ""} ${
        data?.KKTime2 ? data.KKTime2 + " tháng" : ""
      }`;
    default:
      return data[name];
  }
}

export function grid({ label, name, isDate, translate, data, classes }: any) {
  const fomatDate =(date) =>{
    const day = +moment(date).format("DD");
    const month = +moment(date).format("MM");
    const year = +moment(date).format("YYYY");
    return `${day}/${month}/${year}`
  }
  const date = data[name] ? fomatDate(data[name]) : "";
  return (
    <Grid item xs={12} sm={name === "note" ? 12 : 3} className={classes.grid}>
      <TextField
        fullWidth
        label={translate(label)}
        value={
          (isDate
            ? date === "Invalid date"
              ? ""
              : date
            : renderValue(name, data)) || ""
        }
        InputProps={{
          readOnly: true,
        }}
      />
    </Grid>
  );
}

export function renderInfo(categoryKey) {
  switch (categoryKey) {
    case "LT":
      return [
        { label: "recordsManagement.code", name: "code" },
        {
          label: "recordsManagement.dateJoinClan",
          name: "dateJoinClan",
          isDate: true,
        },
        { label: "recordsManagement.date", name: "date", isDate: true },
        { label: "recordsManagement.position", name: "position" },
        { label: "recordsManagement.organ", name: "organ" },
        { label: "recordsManagement.retire", name: "retire", isDate: true },
        {
          label: "recordsManagement.startDateRevolution",
          name: "startDateRevolution",
          isDate: true,
        },
        {
          label: "recordsManagement.endDateRevolution",
          name: "endDateRevolution",
          isDate: true,
        },
        { label: "recordsManagement.note", name: "note" },
      ];
    case "TKN":
      return [
        { label: "recordsManagement.code", name: "code" },
        {
          label: "recordsManagement.dateJoinClan",
          name: "dateJoinClan",
          isDate: true,
        },
        { label: "recordsManagement.date", name: "date", isDate: true },
        { label: "recordsManagement.position", name: "position" },
        { label: "recordsManagement.organ", name: "organ" },
        { label: "recordsManagement.retire", name: "retire", isDate: true },
        {
          label: "recordsManagement.roleRevolution",
          name: "roleRevolution",
        },
        {
          label: "recordsManagement.takeOfficeDate",
          name: "takeOfficeDate",
          isDate: true,
        },
        { label: "recordsManagement.revolutionCM", name: "note" },
      ];
    case "LS":
      return [
        { label: "recordsManagement.code", name: "code" },
        {
          label: "recordsManagement.degreeTQGC",
          name: "degree",
        },
        {
          label: "recordsManagement.decidedTQGC",
          name: "decided",
        },
        {
          label: "recordsManagement.timeDegree",
          name: "decidedDate",
          isDate: true,
        },
        {
          label: "recordsManagement.deathCertificateNum",
          name: "deathCertificateNum",
        },
        {
          label: "recordsManagement.deathCertificateDate",
          name: "deathCertificateDate",
          isDate: true,
        },
        {
          label: "recordsManagement.of",
          name: "of",
        },
        {
          label: "recordsManagement.objectTo",
          name: "object",
        },
        {
          label: "recordsManagement.burialGrave",
          name: "burialGrave",
        },
        { label: "recordsManagement.revolutionCM", name: "note" },
      ];
    case "BM":
      return [
        { label: "recordsManagement.code", name: "code" },
        {
          label: "recordsManagement.organManager",
          name: "organManager",
        },
        {
          label: "recordsManagement.decidedPTDH",
          name: "decided",
        },
        {
          label: "recordsManagement.decidedDate",
          name: "decidedDate",
          isDate: true,
        },

        { label: "recordsManagement.note", name: "note" },
      ];
    case "AHLL":
    case "AHKC":
      return [
        { label: "recordsManagement.code", name: "code" },
        {
          label: "recordsManagement.organManager",
          name: "organManager",
        },
        {
          label: "recordsManagement.decidedPTDH",
          name: "decided",
        },
        {
          label: "recordsManagement.decidedDate",
          name: "decidedDate",
          isDate: true,
        },
        {
          label: "recordsManagement.decisionKind",
          name: "decisionKind",
        },
        { label: "recordsManagement.note", name: "note" },
      ];
    case "AQ":
      return [
        { label: "recordsManagement.code", name: "code" },
        {
          label: "recordsManagement.injuredCertificateNumber",
          name: "injured",
        },
        {
          label: "recordsManagement.injuredVerifyDate",
          name: "verifyDate",
          isDate: true,
        },
        {
          label: "recordsManagement.injuredDate",
          name: "injuredDate",
          isDate: true,
        },
        {
          label: "recordsManagement.inspectionNum",
          name: "inspectionNum",
        },
        {
          label: "recordsManagement.inspectionDate",
          name: "inspectionDate",
          isDate: true,
        },
        {
          label: "recordsManagement.inspectionBoard",
          name: "inspectionBoard",
        },
      ];
    case "BB":
      return [
        { label: "recordsManagement.code", name: "code" },
        {
          label: "recordsManagement.sickSoldierCertificateNumber",
          name: "injured",
        },
        {
          label: "recordsManagement.sickSoldierVerifyDate",
          name: "verifyDate",
          isDate: true,
        },
        {
          label: "recordsManagement.medicalAssessmentNum",
          name: "medicalAssessmentNum",
        },
        {
          label: "recordsManagement.medicalAssessmentDate",
          name: "medicalAssessmentDate",
          isDate: true,
        },
        { label: "recordsManagement.of", name: "of" },
        {
          label: "recordsManagement.medicalCondition",
          name: "medicalCondition",
        },
      ];
    case "BT":
      return [{ label: "recordsManagement.code", name: "code" }];

    case "HH":
      return [
        { label: "recordsManagement.code", name: "code" },

        {
          label: "recordsManagement.medicalAssessmentNum",
          name: "medicalAssessmentNum",
        },
        {
          label: "recordsManagement.medicalAssessmentDate",
          name: "medicalAssessmentDate",
          isDate: true,
        },
        { label: "recordsManagement.of", name: "of" },
        {
          label: "recordsManagement.certificationNum",
          name: "certificationNum",
        },
        {
          label: "recordsManagement.certificationDate",
          name: "certificationDate",
          isDate: true,
        },
        { label: "recordsManagement.ofCDHH", name: "ofCDHH" },
      ];
    case "KC":
      return [
        { label: "recordsManagement.code", name: "code" },
        { label: "recordsManagement.reward", name: "reward" },

        { label: "recordsManagement.decidedPTDH", name: "decided" },

        {
          label: "recordsManagement.decidedDate",
          name: "decidedDate",
          isDate: true,
        },
        {
          label: "recordsManagement.startDateKC",
          name: "startDateRevolution",
          isDate: true,
        },
        {
          label: "recordsManagement.endDateKC",
          name: "endDateRevolution",
          isDate: true,
        },
        { label: "recordsManagement.note", name: "note" },
      ];
    case "CC":
      return [
        { label: "recordsManagement.code", name: "code" },
        { label: "recordsManagement.reward", name: "reward" },

        { label: "recordsManagement.decidedPTDH", name: "decided" },

        {
          label: "recordsManagement.decidedDate",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.situation", name: "note" },
      ];
  }
}

export function renderNccInfo(categoryKey) {
  switch (categoryKey) {
    case "LS":
      return [
        { label: "common.fullName", name: "fullName" },
        {
          label: "recordsManagement.dateOfBirth",
          name: "dateOfBirth",
        },
        { label: "recordsManagement.gender", name: "gender" },
        { label: "recordsManagement.deadTime", name: "dead" },
        { label: "common.ethnic", name: "ethnic" },
        { label: "recordsManagement.identityCard", name: "identityCard" },
        { label: "recordsManagement.supplyDate", name: "date", isDate: true },
        {
          label: "recordsManagement.enlistmentDate",
          name: "enlistmentDate",
          isDate: true,
        },
        { label: "recordsManagement.level", name: "level" },
        { label: "recordsManagement.sacrificialUnit", name: "sacrificialUnit" },
        {
          label: "recordsManagement.sacrificialPlace",
          name: "sacrificialPlace",
        },
        { label: "recordsManagement.sacrificialCase", name: "sacrificialCase" },
      ];
    case "BB":
      return [
        { label: "common.fullName", name: "fullName" },
        {
          label: "recordsManagement.dateOfBirth",
          name: "dateOfBirth",
        },
        { label: "recordsManagement.gender", name: "gender" },
        { label: "common.ethnic", name: "ethnic" },
        { label: "recordsManagement.identityCard", name: "identityCard" },
        { label: "recordsManagement.supplyDate", name: "date", isDate: true },
        { label: "recordsManagement.place", name: "place" },
        {
          label: "recordsManagement.enlistmentTime",
          name: "enlistmentDate",
          isDate: true,
        },
        { label: "recordsManagement.enlistmentUnit", name: "enlistmentUnit" },
        {
          label: "recordsManagement.demobilizationTime",
          name: "demobilizationTime",
          isDate: true,
        },
        {
          label: "recordsManagement.demobilizationUnit",
          name: "demobilizationUnit",
        },
        {
          label: "recordsManagement.demobilizationRank",
          name: "demobilizationRank",
        },
        {
          label: "recordsManagement.CATime",
          name: "CATime",
        },
        {
          label: "recordsManagement.CTTime",
          name: "CTTime",
        },
        {
          label: "recordsManagement.KKTime",
          name: "KKTime",
        },
      ];
    case "AQ":
      return [
        { label: "common.fullName", name: "fullName" },
        {
          label: "recordsManagement.dateOfBirth",
          name: "dateOfBirth",
        },
        { label: "recordsManagement.gender", name: "gender" },
        { label: "common.ethnic", name: "ethnic" },
        { label: "recordsManagement.identityCard", name: "identityCard" },
        { label: "recordsManagement.supplyDate", name: "date", isDate: true },
        { label: "recordsManagement.place", name: "place" },
        {
          label: "recordsManagement.enlistmentTime",
          name: "enlistmentDate",
          isDate: true,
        },
        { label: "recordsManagement.organ", name: "unit" },
        { label: "recordsManagement.rank", name: "rank" },
        { label: "recordsManagement.injuredPlace", name: "injuredPlace" },
        { label: "recordsManagement.type", name: "type" },
        { label: "recordsManagement.injuredCase", name: "injuredCase" },
        {
          label: "recordsManagement.injuredCondition",
          name: "injuredCondition",
        },
      ];
    case "HH":
      return [
        { label: "common.fullName", name: "fullName" },
        {
          label: "recordsManagement.dateOfBirth",
          name: "dateOfBirth",
        },
        { label: "recordsManagement.gender", name: "gender" },
        { label: "common.ethnic", name: "ethnic" },
        { label: "recordsManagement.identityCard", name: "identityCard" },
        { label: "recordsManagement.supplyDate", name: "date", isDate: true },
        { label: "recordsManagement.place", name: "place" },
        {
          label: "recordsManagement.enlistmentTime",
          name: "enlistmentDate",
          isDate: true,
        },
        { label: "recordsManagement.proof", name: "proof" },
        { label: "recordsManagement.organ", name: "unit" },
        {
          label: "recordsManagement.disabilityCondition",
          name: "disabilityCondition",
        },
      ];
    default:
      return [
        { label: "common.fullName", name: "fullName" },
        {
          label: "recordsManagement.dateOfBirth",
          name: "dateOfBirth",
        },
        { label: "recordsManagement.gender", name: "gender" },
        { label: "common.ethnic", name: "ethnic" },
        { label: "recordsManagement.identityCard", name: "identityCard" },
        { label: "recordsManagement.supplyDate", name: "date", isDate: true },
        { label: "recordsManagement.place", name: "place" },
      ];
  }
}
export function renderMoveInfo(type) {
  return [
    { label: "recordsManagement.decisionNumber", name: "decided" },
    { label: "recordsManagement.decision", name: "person" },
    { label: "recordsManagement.organDecision", name: "organ" },
    {
      label: `recordsManagement.${
        type === "come" ? "moveInDate" : "transferDate"
      }`,
      name: "date",
      isDate: true,
    },
    {
      label: `recordsManagement.${
        type === "come" ? "addressBefore" : "addressMove"
      }`,
      name: `${type === "come" ? "moveIn" : "transfer"}`,
    },
    { label: "recordsManagement.province", name: "province" },
    { label: "recordsManagement.district", name: "district" },
    { label: "recordsManagement.ward", name: "ward" },
  ];
}

export function renderAddress(categoryKey) {
  switch (categoryKey) {
    case "LS":
      return [
        { label: "recordsManagement.nativePlace", name: "nativePlace" },
        { label: "recordsManagement.province", name: "province" },
        { label: "recordsManagement.district", name: "district" },
        { label: "recordsManagement.ward", name: "ward" },
      ];
    default:
      return [
        { label: "recordsManagement.nativePlace", name: "nativePlace" },
        { label: "recordsManagement.province", name: "province" },
        { label: "recordsManagement.district", name: "district" },
        { label: "recordsManagement.ward", name: "ward" },
        { label: "recordsManagement.address", name: "address" },
      ];
  }
}
export function renderBeneficiary(relationship: string, categoryKey: string) {
  switch (relationship) {
    case "beneficiary":
      return [
        { label: "common.fullName", name: "fullName" },
        {
          label: "recordsManagement.dateOfBirth",
          name: "dateOfBirth",
        },
        { label: "recordsManagement.gender", name: "gender" },
        { label: "recordsManagement.identityCard", name: "identityCard" },
        { label: "recordsManagement.supplyDate", name: "date", isDate: true },
        { label: "recordsManagement.place", name: "place" },
        { label: "recordsManagement.nativePlace", name: "nativePlace" },
        { label: "recordsManagement.province", name: "province" },
        { label: "recordsManagement.district", name: "district" },
        { label: "recordsManagement.ward", name: "ward" },
        { label: "recordsManagement.address", name: "address" },
        { label: "recordsManagement.relation", name: "relation" },
      ];
    case "relative":
      return [
        { label: "common.fullName", name: "fullName" },
        {
          label: "recordsManagement.dateOfBirth",
          name: "dateOfBirth",
        },
        { label: "recordsManagement.gender", name: "gender" },
        { label: "recordsManagement.identityCard", name: "identityCard" },
        { label: "recordsManagement.supplyDate", name: "date", isDate: true },
        { label: "recordsManagement.place", name: "place" },
        { label: "recordsManagement.nativePlace", name: "nativePlace" },
        { label: "recordsManagement.province", name: "province" },
        { label: "recordsManagement.district", name: "district" },
        { label: "recordsManagement.ward", name: "ward" },
        {
          label: "recordsManagement.dateOfNccDeath",
          name: "dateOfNccDeath",
          isDate: true,
          isMartyrs: categoryKey === "LS",
        },
        { label: "recordsManagement.relation", name: "relation" },
        { label: "recordsManagement.beneficiaryObj", name: "beneficiaryObj" },
      ];
  }
}
