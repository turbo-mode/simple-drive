import type { AxiosRequestConfig } from "axios";
import { useMutation } from "react-query";
import { fileService } from "services";

interface PIUploadFileMutation {
  data: string | ArrayBuffer;
  config?: AxiosRequestConfig;
}
export const useUploadFile = () => {
  return useMutation(({ data, config }: PIUploadFileMutation) =>
    fileService.uploadFiles(data, config)
  );
};
