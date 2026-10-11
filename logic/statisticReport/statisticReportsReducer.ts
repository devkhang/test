import Doet from "api/Doet";
import Year from "api/Year";
import axios from "axios";
import _ from "lodash";
import { ProfileReportService } from "services/profileReport.service";
import { StaticReportService } from "services/static-report.service";
import { get } from "src/hooks/useLocalStorage";

const validate = (start, end) => {
  const error =
    start != "Invalid date" &&
    end != "Invalid date" &&
    start != null &&
    end != null;
  return error;
};
const infoDomain = get("infoDomain");
const user = get("user");

const upload = (option?: {
  extensions?: string[];
  maxSizeInMb?: number;
  validator?: (fileName: string) => string;
}) => {
  const uploadId = "U1e09c1c0-b647-437e-995e-d7a1a1b60550";
  const promise = new Promise<File | null>((resolve, reject) => {
    const body = document.getElementsByTagName("body")?.[0];
    if (!body) {
      resolve(null);
      return;
    }
    const existedElement = document.getElementById(uploadId);
    if (existedElement) {
      existedElement.remove();
    }
    const element = document.createElement("input");
    element.setAttribute("id", uploadId);
    element.setAttribute("type", "file");
    element.style.display = "none";
    body.appendChild(element);
    element.addEventListener("change", (evt: any) => {
      try {
        const target = evt.target as DataTransfer;
        const file = target.files.item(0);
        if (file) {
          const lastDot = file.name.lastIndexOf(".");
          if (lastDot === -1) {
            throw new Error(`Tập tin không đúng định dạng`);
          }
          const extension = file.name.substring(lastDot + 1);
          if (option) {
            if (
              option.extensions?.length &&
              !option.extensions.some(
                (e) => e.toUpperCase() === extension.toUpperCase()
              )
            ) {
              throw new Error(
                `Tập tin tải lên không đúng định dạng: ${option.extensions.join()}`
              );
            }
            if (
              option.maxSizeInMb &&
              option.maxSizeInMb > 0 &&
              option.maxSizeInMb * 1024 * 1024 < file.size
            ) {
              const message = `[${file.name}] Dung lượng tối đa ${option.maxSizeInMb} Mbs`;
              throw new Error(message);
            }
            if (option.validator && option.validator(file.name)) {
              const message = option.validator(file.name);
              throw new Error(message);
            }
          }
          resolve(file);
        }
      } catch (error) {
        reject(error);
      }
    });
    element.click();
  });
  return promise;
};

export default function statisticReportReducer({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
}: any) {
  const cases: any = {
    initial: async () => {
      const isDomain = user?.unitId === user?.doet; //so
      const res: any = {};

      dispatch("onLoading");
      const [dataYear, dataDoet] = await Promise.all([
        Year.get({ where: { status: true }, order: { year: "DESC" } }),
        Doet.get({
          where: isDomain ? { parentId: infoDomain?.id } : { id: user?.unitId },
        }),
      ]);

      const data = _.get(dataDoet, "data.items") || [];
      res.doets = isDomain ? [infoDomain, ...data] : [...data];

      res.years = _.get(dataYear, "data.items") || [];
      res.year = res.years[0];
      return { ...res, loading: false };
    },

    onChange: () => {
      const { name, value } = action;
      return { [name]: value };
    },

    getLink: async () => {
      const { name } = action;
      const { type, year, month, doet } = state;
      return StaticReportService.generateKey({
        type,
        year,
        month: type === "bc-01" || type === "bc-02" ? month || null : null,
        doet,
      })
        .then((key) => {
          return StaticReportService.get(key)
            .then((data) => {
              if (!data?.file?.cdn) {
                throw new Error("Không tìm thấy báo cáo");
              }
              if (name === "onSearch") {
                return {
                  src: `https://view.officeapps.live.com/op/embed.aspx?src=${data?.file?.cdn}`,
                };
              } else {
                window.open(data?.file?.cdn, "_self");
              }
            })
            .catch((err) => {
              enqueueSnackbar(err?.message || "Có lỗi xảy ra", {
                variant: "error",
              });
              console.error(err);
            });
        })
        .catch((err) => {
          enqueueSnackbar(err?.message || "Có lỗi xảy ra khi sinh key", {
            variant: "error",
          });
          console.error(err);
        });
    },
    getReport: async () => {
      const { type,  name, token, fileName } = action;
      const url = new URL(`https://api.rcp.com.vn/api/v1/profiles/${name}`);
      return await axios({
        url: `${url}`, //your url
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
        .then(response => {
          let filename = '';
          const disposition = response.headers['content-disposition'];
          if (disposition && disposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
            }
          }
          filename = filename || fileName || name || '';
          const file = new Blob([response.data], { type: response.data?.type });
          const url = window.URL.createObjectURL(file);
          const link = document.createElement('a');
          link.href = url;
          if (filename) {
            link.setAttribute('download', filename);
          }
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          enqueueSnackbar(err?.message || "Có lỗi xảy ra ", {
            variant: "error",
          });
          console.error(err);
        });
    },

    onUpload: async () => {
      const { type, year, month, doet } = state;
      StaticReportService.generateKey({
        type,
        year,
        month: type === "bc-01" || type === "bc-02" ? month || null : null,
        doet,
      })
        .then((key) => {
          upload({
            extensions: ["xlsx", "xls"],
          })
            .then((file) => {
              if (file) {
                StaticReportService.upload(key, file)
                  .then(() => {
                    enqueueSnackbar("Upload báo cáo thành công", {
                      variant: "success",
                    });
                  })
                  .catch((err) => {
                    enqueueSnackbar(err?.message || "Có lỗi xảy ra", {
                      variant: "error",
                    });
                    console.error(err);
                  });
              }
            })
            .catch((err) => {
              enqueueSnackbar(err?.message || "Có lỗi xảy ra khi upload", {
                variant: "error",
              });
              console.error(err);
            });
        })
        .catch((err) => {
          enqueueSnackbar(err?.message || "Có lỗi xảy ra khi sinh key", {
            variant: "error",
          });
          console.error(err);
        });
    },

    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
}
