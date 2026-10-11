import axios from "axios";

// Api Service chỉ quản lý token
const KEY = "token";
const token = () => {
  return localStorage.getItem(KEY) as string;
};

const handleResponse = (response: any) => {
  if (response.statusCode === 401) {
    throw new Error(response?.message || "Có lỗi xảy ra");
  } else if (!response.success) {
    throw new Error(response?.message || "Có lỗi xảy ra");
  }
};

const get = async <T = any>(path: string, params?: any): Promise<T> => {
  const url = new URL(path);
  params &&
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();
  handleResponse(res);
  return res?.data;
};

const post = async <T = any>(
  path: string,
  body: any,
  params?: any,
  noAuthorization?: boolean
): Promise<T> => {
  const url = new URL(path);
  params &&
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  const response = await fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();
  handleResponse(res);
  return res?.data || res;
};

const upload = async <T = any>(
  path: string,
  file: File,
  params?: any
): Promise<T> => {
  const url = new URL(path);
  params &&
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

  let formData = new FormData();
  formData.append("file", file);
  const response = await fetch(url.toString(), {
    method: "POST",
    body: formData,
    headers: {
      // hard code token
      ...(token() && {
        Authorization: `Bearer ${token()}`,
      }),
    },
  });
  const res = await response.json();
  handleResponse(res);
  if ("total" in res) {
    return {
      items: res?.data || [],
      total: res.total || 0,
    } as any;
  }
  return res?.data;
};

const download = async (path: string, name?: string) => {
  const url = new URL(path);
  return await axios({
    url: `${url}`, //your url
    method: "GET",
    responseType: "blob",
  })
    .then((response) => {
      let filename = "";
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }
      filename = filename || name || "";
      const file = new Blob([response.data], { type: response.data?.type });
      const url = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      if (filename) {
        link.setAttribute("download", filename);
      }
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      console.error(error);
    });
};

const readFile = async (file: File, name?: string) => {
  let fileName = name || `Export-${new Date()}.xlsx`;
  let type = "application/octet-stream";
  const fileDownload = new Blob([file], { type });
  const url = window.URL.createObjectURL(fileDownload);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
};

export const ApiService = {
  get,
  post,
  upload,
  download,
};
