import api from "./api";
import type { AxiosRequestConfig } from "axios";

const fileService = {
  // upload files
  async uploadFiles(
    data: string | ArrayBuffer,
    config: AxiosRequestConfig = {}
  ) {
    return api.post("/upload", data, config).then((res) => res.data);
  },
};

export default fileService;
