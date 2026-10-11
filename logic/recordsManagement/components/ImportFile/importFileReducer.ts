import _ from "lodash";
import Upload from "api/Upload";
import Profile from "api/Profile";
import { uuidv4 } from "../utils";
import { AwsService } from "services/aws/aws.service";

export const importFileReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any): any => {
  const { profile } = props;
  const cases: any = {
    initial: async () => {
      const relation = ["files"];
      let files: any = {};
      if (!!profile) {
        dispatch("onLoading");
        const profileApi = await Profile.get({
          where: { id: profile },
          relation: JSON.stringify(relation),
        });
        if (!profileApi.success) {
          enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
        } else {
          const filesArr = _.get(profileApi, "data.items[0].files") || [];
          const id = filesArr[filesArr.length - 1]?.id;
          if (!!id) {
            const filesApi = await Upload.getDetailFile(id);
            const data = _.get(filesApi, "data", []);
            for (let i = 0; i < data.length; i++) {
              files = { ...files, ...data[i], id };
            }
          }
        }
      }
      return { ...files, loading: false };
    },

    handleDropFile: async () => {
      const { name, data } = action;
      const res: any = {};

      if (data[0]?.size > 8 * 1024 * 1024) {
        enqueueSnackbar(translate("recordsManagement.sizeErr"), {
          variant: "error",
        });
        return {};
      } else {
        dispatch("onLoading");
        if (data.length > 1) {
          enqueueSnackbar(translate("recordsManagement.errorMessage"), {
            variant: "error",
          });
          return { loading: false };
        }
        const uploadApi = await AwsService.upload(data[0])
          .then((file) => {
            enqueueSnackbar(translate("common.loadSuccess"), {
              variant: "success",
            });
            const newData = {
              ...data[0],
              name: file.key || "",
              size: file.fileSize,
              path: file.fileName,
              id: uuidv4(),
              url: file.cdn,
            };
            res[name] = [...state[name], newData];
          })
          .catch((err) => {
            enqueueSnackbar(err.message, {
              variant: "error",
            });
            return { loading: false };
          });
          
        // const uploadApi = await Upload.uploadFile(data);
        // if (!uploadApi.success) {
        //   enqueueSnackbar(
        //     translate(
        //       uploadApi.errors?.message === "File not support"
        //         ? "recordsManagement.errorSupport"
        //         : "recordsManagement.errorMessage"
        //     ),
        //     {
        //       variant: "error",
        //     }
        //   );
        //   return { loading: false };
        // } else {
        //   enqueueSnackbar(translate("common.loadSuccess"), {
        //     variant: "success",
        //   });

        //   const newData = {
        //     ...data[0],
        //     name: uploadApi.data.public_id || "",
        //     size: data[0].size,
        //     id: uuidv4(),
        //     url: uploadApi.data.public_url,
        //   };
        //   res[name] = [...state[name], newData];
        // }
      }
      return { ...res, loading: false };
    },

    removeItem: () => {
      const { nameFile, file } = action;
      const filteredItems = (state[nameFile] || []).filter(
        (i: any) => i !== file
      );
      return { [nameFile]: filteredItems };
    },

    removeAll: () => {
      const { nameFile } = action;
      return { [nameFile]: [] };
    },

    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
};
