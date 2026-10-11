import _ from "lodash";
import * as XLSX from "ts-xlsx";
import Record from "api/Record";
import Province from "api/Province";
import Profile from "api/Profile";
import Ethnic from "api/Ethnic";
import { unaccent } from "logic/recordsManagement/util";
import { categoryIPF, converContantToReward } from "../../utils";
import { get } from "src/hooks/useLocalStorage";

interface Props {
  file: any;
  ethnics: any;
  categoryId: any;
  provinces: any;
  dispatch: any;
  wards: any;
  districts: any;
  categoryKey: any;
}

const converStringToDate = (string: string) => {
  const newDate = string.includes("-")
    ? string.replace(/(\d+[-])(\d+[-])/, "$2$1")
    : string.replace(/(\d+[/])(\d+[/])/, "$2$1");

  return new Date(newDate);
};

const validate = (data: any) => {
  if (
    _.isEmpty(data.code) ||
    _.isEmpty(data.fullName) ||
    _.isEmpty(data.province) ||
    _.isEmpty(data.district) ||
    _.isEmpty(data.ward) ||
    ![0, 1].includes(data.gender)
  )
    return true;
  return false;
};

const haveDataNTH = (infoBeneficiaries) => {
  const tmp =
    !!infoBeneficiaries.fullName ||
    !!infoBeneficiaries.dateOfBirth ||
    !!infoBeneficiaries.gender ||
    !!infoBeneficiaries.province ||
    !!infoBeneficiaries.district ||
    !!infoBeneficiaries.ward ||
    !!infoBeneficiaries.relation;
  return tmp;
};

const getParamInfoNcc = (arr, index, name) => {
  const paramInfoNcc: any = {};

  if (name === "CATime" || name === "CTTime" || name === "KKTime") {
    const valueInput = unaccent(arr[index][name] || "").replace(/\s/g, "");
    const indxNam = valueInput.indexOf("nam");
    const indxThang = valueInput.indexOf("thang");

    paramInfoNcc[`${name}1`] =
      indxNam > 0 ? +valueInput.substring(0, indxNam) || null : null;

    paramInfoNcc[`${name}2`] =
      indxThang > 0
        ? indxNam > 0
          ? +valueInput.substring(indxNam + 3, indxThang) || null
          : +valueInput.substring(0, indxThang) || null
        : null;
  } else {
    paramInfoNcc[name] = arr[index][name] || null;
  }

  return paramInfoNcc;
};

const getInfoAddress = (arr, index) => ({
  address: arr[index]?.address,
  nativePlace: arr[index]?.nativePlace,
  province: arr[index]?.province,
  district: arr[index]?.district,
  ward: arr[index]?.ward,
});

const getInfoNTH = (arr, index) => ({
  fullName: arr[index]?.fullNameNTH,
  dateOfBirth: arr[index]?.dateOfBirthNTH,
  gender: arr[index]?.genderNTH,
  province: arr[index]?.provinceNTH,
  district: arr[index]?.districtNTH,
  ward: arr[index]?.wardNTH,
  relation: arr[index]?.relationNTH,
});

const getDataFromEx = ({
  file,
  categoryId,
  categoryKey,
  provinces,
  ethnics,
  dispatch,
}: Props) => {
  const dataHead: any = categoryIPF(categoryKey);
  const col = (dataHead || []).map((item: any) => item.name);
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async function (event) {
      try {
        let rows: any = [];
        let temp: any = [];
        const arrayBuffer: any = fileReader.result;
        const data = new Uint8Array(arrayBuffer);
        const arr = new Array();
        for (let i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        const bstr = arr.join("");
        const workbook = XLSX.read(bstr, { type: "binary" });
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const dataImport = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const header =
          categoryKey === "LS"
            ? [
                "STT",
                "code",
                "fullName",
                "dateOfBirth",
                "ethnic",
                "gender",
                "nativePlace",
                "province",
                "district",
                "ward",
                "fullNameNTH",
                "dateOfBirthNTH",
                "genderNTH",
                "provinceNTH",
                "districtNTH",
                "wardNTH",
                "relationNTH",
                ...col,
              ]
            : [
                "STT",
                "code",
                "fullName",
                "dateOfBirth",
                "ethnic",
                "gender",
                "nativePlace",
                "province",
                "district",
                "ward",
                "address",
                "fullNameNTH",
                "dateOfBirthNTH",
                "genderNTH",
                "provinceNTH",
                "districtNTH",
                "wardNTH",
                "relationNTH",
                ...col,
              ];
        const content = dataImport
          .slice(6, dataImport.length + 1)
          .filter((i: any) => {
            const isData = i.filter((j) => {
              j.replace(/\s/g, "");
              return !_.isEmpty(j);
            });
            return isData.length > 5;
          });

        content.forEach((row: any) => {
          let rowdata: any = {};
          row.forEach((element: any, index: any) => {
            rowdata[header[index]] = element;
            const head = dataHead.find((i) => i.name === header[index]);
            if (head?.isDate) {
              rowdata[header[index]] = converStringToDate(element);
            }
            if (head?.isSelect) {
              rowdata[header[index]] = converContantToReward(
                unaccent(element || "").replace(/ /g, "")
              );
            }
          });
          temp = [...temp, rowdata];
        });

        dispatch({ type: "openSnackbar", sum: temp.length });

        for (let j = 0; j < temp.length; j++) {
          dispatch({ type: "count", name: "countLoad" });

          const province = provinces.find(
            (p: any) =>
              unaccent(temp[j]?.province || "").replace(/ /g, "") ===
              unaccent(p?.value || "").replace(/ /g, "")
          );

          const res: any = {};
          const dataDistricts = await Province.getDistrict(province?.key);

          if (!_.isEmpty(dataDistricts)) {
            const districts = _.get(dataDistricts, "data") || [];
            res.district = districts.find(
              (d: any) =>
                unaccent(temp[j]?.district || "").replace(/ /g, "") ===
                unaccent(d?.value || "").replace(/ /g, "")
            );
            const dataWard = await Province.getWard(res?.district?.key);
            const wards = _.get(dataWard, "data") || [];

            res.ward = (wards || []).find(
              (w: any) =>
                unaccent(temp[j]?.ward || "").replace(/ /g, "") ===
                unaccent(w?.value || "").replace(/ /g, "")
            );
          }

          if (!!temp[j]?.provinceNTH) {
            res.provinceNTH = provinces.find(
              (p: any) =>
                unaccent(temp[j]?.provinceNTH || "").replace(/ /g, "") ===
                unaccent(p?.value || "").replace(/ /g, "")
            );

            const dataDistrictsNTH = await Province.getDistrict(
              res.provinceNTH?.key
            );
            if (!_.isEmpty(dataDistrictsNTH)) {
              const districtsNTH = _.get(dataDistrictsNTH, "data") || [];
              res.districtNTH = districtsNTH.find(
                (d: any) =>
                  unaccent(temp[j]?.districtNTH || "").replace(/ /g, "") ===
                  unaccent(d?.value || "").replace(/ /g, "")
              );
              const dataWardNTH = await Province.getWard(res?.districtNTH?.key);
              const wardsNTH = _.get(dataWardNTH, "data") || [];

              res.wardNTH = (wardsNTH || []).find(
                (w: any) =>
                  unaccent(temp[j]?.wardNTH || "").replace(/ /g, "") ===
                  unaccent(w?.value || "").replace(/ /g, "")
              );
            }
          }

          rows = [
            ...rows,
            {
              ...temp[j],
              code: temp[j]?.code,
              fullName: temp[j]?.fullName,
              nativePlace: temp[j]?.nativePlace,
              dateOfBirth: temp[j]?.dateOfBirth,
              ethnic: ethnics.find(
                (i) =>
                  unaccent(temp[j]?.ethnic || "").replace(/ /g, "") ===
                  unaccent(i?.name || "").replace(/ /g, "")
              ),
              gender:
                temp[j]?.gender?.toUpperCase().replace(/ /g, "") === "NAM"
                  ? 0
                  : unaccent(temp[j]?.gender || "").replace(/ /g, "") === "nu"
                  ? 1
                  : null,
              province: { key: province?.key, value: province?.value },
              district: res?.district,
              ward: res?.ward,
              categoryId: categoryId,
              genderNTH:
                temp[j]?.genderNTH?.toUpperCase().replace(/ /g, "") === "NAM"
                  ? 0
                  : unaccent(temp[j]?.genderNTH || "").replace(/ /g, "") ===
                    "nu"
                  ? 1
                  : null,
              provinceNTH: res.provinceNTH,
              districtNTH: res?.districtNTH,
              wardNTH: res?.wardNTH,
            },
          ];
        }

        return resolve(rows);
      } catch (error) {
        reject(error);
      }
    };
    fileReader.readAsArrayBuffer(file);
  });
};

const infoDomain = get("infoDomain");
const moetId = !infoDomain?.parentId ? infoDomain?.id : infoDomain?.parentId;

export default function importFileReducer({
  state,
  action,
  dispatch,
  props,
}: any) {
  const {
    onClose,
    onClick,
    onDontClose,
    datas: { provinces, categoryId, categoryKey, doet },
  } = props;
  const cases: any = {
    getFile: async () => {
      const { e, name } = action;
      const { wards, districts, ethnics } = state;
      onDontClose && onDontClose(false);

      const file =
        name === "onChange" ? e.target.files[0] : e.dataTransfer.files[0];
      dispatch("onLoading");

      const temps: any = await getDataFromEx({
        file,
        ethnics,
        categoryId,
        categoryKey,
        provinces,
        dispatch,
        wards,
        districts,
      });

      for (let i = 0; i < temps.length; i++) {
        dispatch({ type: "count", name: "countUser" });
        let res = temps[i];
        const responseApi = await Record.checkCode({ code: temps[i]?.code });

        if (validate(temps[i])) {
          res = { ...temps[i], isError: 1 };
        }

        if (responseApi.isExisted) {
          res = {
            ...temps[i],
            isError: 2,
            profile_id: responseApi.profile,
            info_id: responseApi.info,
            infoNcc_id: responseApi.infoNCC,
            address_id: responseApi.address,
            beneficiaries_id: responseApi.beneficiaries,
          };
        }
        temps[i] = res;
      }

      onDontClose && onDontClose(true);
      return {
        rows: temps,
        loading: false,
        open: false,
        countUser: 0,
        countLoad: 0,
        sumLoad: 0,
      };
    },

    delete: () => {
      const {
        data: { rowIdx },
      } = action;
      const { rows } = state;
      rows.splice(rowIdx, 1);

      return { rows };
    },

    getProvince: async () => {
      const { name, key } = action;
      const res: any = {};

      if (name === "district") {
        const { data: districts } = await Province.getDistrict(key);
        res.districts = districts || [];
      }
      if (name === "ward") {
        const { data: wards } = await Province.getWard(key);
        res.wards = wards || [];
      }

      return { ...res };
    },

    saveNew: async () => {
      dispatch("onLoading");
      dispatch("openSnackbar");
      const { rows } = state;
      const arrNewUsers = rows.filter(
        (item: any) => ![1, 2].includes(item.isError)
      );
      const arrDuplicateUsers = rows.filter((item: any) => item.isError === 2);
      const err: any = [];
      const success: any = [];
      const dataHead = categoryIPF(categoryKey);

      onDontClose && onDontClose(false);

      for (let i = 0; i < arrNewUsers.length; i++) {
        dispatch({ type: "count", name: "countAdd" });
        const paramInfos: any = {};
        const paramInfoNcc: any = {};

        dataHead.forEach((item) => {
          const name = item?.name;

          if (item?.type === "infos") {
            paramInfos[name] =
              arrNewUsers[i][name] === 0 ? 0 : arrNewUsers[i][name] || null;
          }

          if (item?.type === "infoNcc") {
            getParamInfoNcc(arrNewUsers, i, name);
          }
        });

        const relationship =
          categoryKey === "LS" ? { relative: true } : { beneficiary: true };

        const valueInfoBeneficiaries = getInfoNTH(arrNewUsers, i);
        const valueInfoAddress = getInfoAddress(arrNewUsers, i);

        const point = !haveDataNTH(valueInfoBeneficiaries)
          ? 2
          : categoryKey === "LS"
          ? 3
          : 4;
        const dataApi = await Profile.post({
          ...arrNewUsers[i],
          categoryId,
          point,
          doet_id: moetId,
          unitId: doet?.id,
        });
        if (!!dataApi?.success) {
          const idProfile = _.get(dataApi, "data.id");
          
          const [] = await Promise.all([
            Record.createInfo(
              {
                ...paramInfos,
                code: arrNewUsers[i]?.code,
                profile: idProfile,
              },
              "infos"
            ),
            Record.createInfo(
              {
                ...paramInfoNcc,
                place:
                  provinces.find(
                    (p: any) =>
                      unaccent(paramInfoNcc?.place || "").replace(/ /g, "") ===
                      unaccent(p?.value || "").replace(/ /g, "")
                  ) || null,
                date:
                  categoryKey === "LS"
                    ? arrNewUsers[i]?.date
                    : arrNewUsers[i]?.supplyDate || null,
                ethnic: arrNewUsers[i]?.ethnic,
                fullName: arrNewUsers[i]?.fullName,
                dateOfBirth: arrNewUsers[i]?.dateOfBirth,
                gender: arrNewUsers[i]?.gender,
                profile: idProfile,
              },
              "infoNccs"
            ),
            Record.createInfo(
              {
                ...valueInfoAddress,
                profile: idProfile,
              },
              "infoAddress"
            ),
          ]);
          if (haveDataNTH(valueInfoBeneficiaries)) {
            const {} = await Record.createInfo(
              {
                ...valueInfoBeneficiaries,
                profile: idProfile,
                status: true,
                ...relationship,
              },
              "infoBeneficiaries"
            );
          }
          success.push(arrNewUsers[i]?.code);
        }
        if (i == arrNewUsers.length - 1 && _.isEmpty(arrDuplicateUsers)) {
          // enqueueSnackbar(`${translate("common.success")}: ${success.length}, ${translate("common.noSuccess")}: ${err.length}`, {
          //   variant: "warning",
          // });
          onClick && onClick();
        }
      }

      arrDuplicateUsers.length > 0 && (await dispatch("updateUsers"));
      onDontClose && onDontClose(true);

      onClose && onClose();
      return { open: false, loading: false, countAdd: 0, countUpdate: 0 };
    },

    updateUsers: async () => {
      const { rows } = state;
      const arrDuplicateUsers = rows.filter((item: any) => item.isError === 2 );
      const dataHead = categoryIPF(categoryKey);

      for (let i = 0; i < arrDuplicateUsers.length; i++) {
        dispatch({ type: "count", name: "countUpdate" });
        const paramInfos: any = {};
        const paramInfoNcc: any = {};

        dataHead.forEach((item) => {
          const name = item?.name;

          if (item?.type === "infos") {
            paramInfos[name] =
              arrDuplicateUsers[i][name] === 0 ? 0 : arrDuplicateUsers[i][name] || null;
          }

          if (item?.type === "infoNcc") {
            getParamInfoNcc(arrDuplicateUsers, i, name);
          }
        });

        const valueBeneficiaries = getInfoNTH(arrDuplicateUsers, i);
        const valueAddress = getInfoAddress(arrDuplicateUsers, i);
        const relationship =
          categoryKey === "LS" ? { relative: true } : { beneficiary: true };

          const point = !haveDataNTH(valueBeneficiaries)
          ? 2
          : categoryKey === "LS"
          ? 3
          : 4;

        const [] = await Promise.all([
          Profile.put(arrDuplicateUsers[i].profile_id, {
            fullName: arrDuplicateUsers[i]?.fullName,
            dateOfBirth: arrDuplicateUsers[i]?.dateOfBirth,
            gender: arrDuplicateUsers[i]?.gender,
            point: point,
            ...valueAddress,
          }),
          Record.editInfo(
            arrDuplicateUsers[i].info_id,
            {
              ...paramInfos,
            },
            "infos"
          ),
          Record.editInfo(
            arrDuplicateUsers[i].infoNcc_id,
            {
              ...paramInfoNcc,
              place:
                provinces.find(
                  (p: any) =>
                    unaccent(paramInfoNcc?.place || "").replace(/ /g, "") ===
                    unaccent(p?.value || "").replace(/ /g, "")
                ) || null,
              date:
                categoryKey === "LS"
                  ? arrDuplicateUsers[i]?.date
                  : arrDuplicateUsers[i]?.supplyDate || null,
              ethnic: arrDuplicateUsers[i]?.ethnic,
              fullName: arrDuplicateUsers[i]?.fullName,
              dateOfBirth: arrDuplicateUsers[i]?.dateOfBirth,
              gender: arrDuplicateUsers[i]?.gender,
            },
            "infoNccs"
          ),
          Record.editInfo(
            arrDuplicateUsers[i].address_id,
            {
              ...valueAddress,
            },
            "infoAddress"
          ),
        ]);
        if (haveDataNTH(valueBeneficiaries)) {
          !!arrDuplicateUsers[i].beneficiaries_id
            ? await Record.editInfo(
                arrDuplicateUsers[i].beneficiaries_id,
                {
                  ...valueBeneficiaries,
                },
                "infoBeneficiaries"
              )
            : await Record.createInfo(
                {
                  ...valueBeneficiaries,
                  profile: arrDuplicateUsers[i].profile_id,
                  status: true,
                  point: point,
                  ...relationship,
                },
                "infoBeneficiaries"
              );
        }
        if (i == arrDuplicateUsers.length - 1) {
          onClick && onClick();
        }
      }
    },

    back: () => {
      onClose && onClose();
      return { open: false, loading: false };
    },

    openSnackbar: () => {
      const { sum } = action;
      return { open: true, sumLoad: sum || 0 };
    },

    emptyRows: async () => {
      const { ethnics } = state;
      const res: any = {};
      res.rows = [];
      if (_.isEmpty(ethnics)) {
        const { data } = await Ethnic.get({});
        res.ethnics = _.get(data, "items") || [];
      }

      return { ...res, countAdd: 0, countUpdate: 0 };
    },

    count: () => {
      const { name } = action;
      return { [name]: state[name] + 1 };
    },

    onLoading: () => {
      return { loading: true };
    },
  };

  return cases[action.type] && cases[action.type]();
}
