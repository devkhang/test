import _ from "lodash";
import Profile from "api/Profile";
import Upload from "api/Upload";

const nameFiles = [
  "LT3",
  "TKN3",
  "TQGCfile",
  "decidedFile",
  "deathFile",
  "injuredFile",
  "assessmentFile",
  "revolutionFile",
  "rewardFile",
  "other",
];
const showDetailReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any) => {
  const { row, categoryKey } = props;
  const newState = {
    info: { inprogressRevolution: [], inprogressJailed: [] },
    infoNcc: { disabilitiesChildren: [] },
    infoAddress: {},
    files: [],
    infoBeneficiary: { beneficiary: {}, relative: {} },
    prefers: [],
  };

  const cases: any = {
    initial: async () => {
      dispatch("showDetail");
      const { infoBeneficiary } = state;
      const relation = [
        "info",
        "infoNcc",
        "infoAddress",
        "files",
        "infoBeneficiary",
      ];
      const res: any = {};
      if (row.id) {
        dispatch("onLoading");
        const profileApi = await Profile.get({
          where: { id: row.id },
          relation: JSON.stringify(relation),
        });
        if (!profileApi.success) {
          enqueueSnackbar(translate("common.errorMes"), {
            variant: "error",
          });
        } else {
          res.info = _.get(profileApi, "data.items[0].info[0]") || {
            inprogressRevolution: [],
            inprogressJailed: [],
          };
          res.infoNcc = _.get(profileApi, "data.items[0].infoNcc[0]") || {
            disabilitiesChildren: [],
          };

          res.infoAddress = _.get(
            profileApi,
            "data.items[0].infoAddress[0]",
            {}
          );

          const beneficiaryData =
            _.get(profileApi, "data.items[0].infoBeneficiary") || [];

          infoBeneficiary.relative =
            beneficiaryData.filter((i) =>
              categoryKey === "LS" ? !!i.relative : !!i.status && !!i.relative
            )[0] || {};

          infoBeneficiary.beneficiary =
            !_.isEmpty(beneficiaryData) && !_.isEmpty(infoBeneficiary.relative)
              ? beneficiaryData.filter((i) => !!i.beneficiary)[0] || {}
              : beneficiaryData.filter(
                  (i) => !!i.status && !!i.beneficiary
                )[0] || {};

          res.otherRelative =
            categoryKey === "LS"
              ? beneficiaryData.filter((i) => !i.relative)
              : [];

          res.prefers = _.get(profileApi, "data.items[0].prefers") || [];
          const fileArr = _.get(profileApi, "data.items[0].files") || [];

          const move = _.get(profileApi, "data.items[0].move") || [];
          const come = move.find((m) => m.type === 0) || {}; //đến
          const transfer = move.find((m) => m.type === 1) || {}; //đi
          res.moveInfo = { come, transfer };

          const moveFilter = move.filter((i) => !_.isEmpty(i.file));
          const moveFiles = moveFilter.map((i) => i.file).flat();

          const attachmentPrefers =
            _.get(profileApi, "data.items[0].attachment") || [];
          const beneficiaryFiles = infoBeneficiary.relative?.files || [];

          dispatch({
            type: "getFiles",
            fileArr,
            moveFiles,
            beneficiaryFiles,
            attachmentPrefers,
          });
        }
      }
      return {
        ...res,
        infoBeneficiary,
        loading: false,
      };
    },
    getFiles: async () => {
      const { fileArr, moveFiles, beneficiaryFiles, attachmentPrefers } =
        action;
      let fileData: any = {};
      const id = fileArr[fileArr.length - 1]?.id;

      if (id) {
        const filesApi = await Upload.getDetailFile(id);
        const data = _.get(filesApi, "data", []);
        for (let i = 0; i < data.length; i++) {
          fileData = { ...fileData, ...data[i], id };
        }
        const arr = nameFiles.map((i) => fileData[i]).flat();
        const files = [
          ...arr,
          ...moveFiles,
          ...beneficiaryFiles,
          ...attachmentPrefers,
        ];
        return { files };
      }
    },

    showDetail: () => ({ showDialog: true }),
    closeDetail: () => ({ ...newState, showDialog: false }),
    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
};
export default showDetailReducer;
